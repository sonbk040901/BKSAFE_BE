import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AccountRepository } from '~repos/account.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthPayload } from './interfaces/auth-payload.interface';
import {
  AccountNotActivatedException,
  ActivationIncorrectWrongException,
  DriverAlreadyActivatedException,
  DriverAlreadyExistsException,
  DriverNotFoundException,
  DriverRegisterIsPending,
  PasswordIncorrectForAlreadyEmailException,
  PhoneNumberAlreadyExistsException,
  PhoneOrPasswordIncorrectException,
  UserAlreadyActivatedException,
  UserNotFoundException,
} from '~/common/exceptions/httpException';
import { BcryptService } from '~utils/bcrypt.service';
import { RegisterDriverDto } from '@auth/dto/register-driver.dto';
import { DriverRepository } from '~repos/driver.repository';
import { RoleRepository } from '~repos/role.repository';
import { ActivateStatus, Driver } from '~entities/driver.entity';
import { UserRepository } from '~repos/user.repository';
import { Account } from '~entities/account.entity';
import { RegisterDriverByUserDto } from '@auth/dto/register-driver-by-user.dto';
import { MatchingStatisticRepository } from '~repos/matching-statistic.repository';
import { User } from '~entities/user.entity';
import { Admin } from '~entities/admin.entity';
import { AdminRepository } from '~repos/admin.repository';
import { ActiveUserDto } from '@auth/dto/active-user.dto';
import { ActionDriverDto } from '@auth/dto/action-driver.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  private readonly ACTIVATION_CODE = '20194658';

  constructor(
    private accountRepository: AccountRepository,
    private driverRepository: DriverRepository,
    private userRepository: UserRepository,
    private adminRepository: AdminRepository,
    private roleRepository: RoleRepository,
    private statisticRepository: MatchingStatisticRepository,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async verify(token: string) {
    const { id } = this.jwtService.verify<AuthPayload>(token);
    const user = await this.accountRepository.findById(id, ['roles']);
    if (!user) throw new PhoneOrPasswordIncorrectException();
    return user;
  }

  async login(loginDto: LoginDto) {
    const role = loginDto.role;
    let account: User | Driver | Admin | null = null;
    switch (role) {
      case 'USER':
        account = await this.userRepository.findOneByPhone(loginDto.phone);
        break;
      case 'DRIVER':
        account = await this.driverRepository.findOneByPhone(loginDto.phone);
        break;
      case 'ADMIN':
        account = await this.adminRepository.findOneByPhone(loginDto.phone);
        break;
    }
    if (!account) throw new PhoneOrPasswordIncorrectException();
    if (account instanceof Driver) {
      if (account.activateStatus !== ActivateStatus.ACTIVATED)
        throw new AccountNotActivatedException();
    } else {
      if (!account.isActivated) throw new AccountNotActivatedException();
    }

    const isMatch = await this.bcryptService.compare(
      loginDto.password,
      account.account.password,
    );
    if (!isMatch) throw new PhoneOrPasswordIncorrectException();

    const payload: AuthPayload = {
      id: account.id,
    };
    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterDto) {
    //todo: gửi mã xác nhận qua phone
    let account = await this.accountRepository.findOneByPhone(
      registerDto.phone,
      ['roles'],
    );
    const isExist = account?.roles.some((role) => role.name === 'user');
    if (isExist) throw new PhoneNumberAlreadyExistsException(registerDto.phone);

    // Nếu đã tồn tại tài khoản role khác rồi thì sẽ chỉ thêm role user
    if (account) {
      const isMatch = await this.bcryptService.compare(
        registerDto.password,
        account.password,
      );
      const roleLength = account.roles.length;
      if (!isMatch && roleLength)
        throw new PasswordIncorrectForAlreadyEmailException();
      // Nếu tài khoản chưa có role nào thì cập nhật lại thông tin đăng ký
      if (roleLength === 0) {
        registerDto.password = await this.bcryptService.hash(
          registerDto.password,
        );
        this.accountRepository.merge(account, registerDto);
      }
    } else {
      // Nếu chưa tồn tại tài khoản thì tạo mới
      registerDto.password = await this.bcryptService.hash(
        registerDto.password,
      );
      account = this.accountRepository.create(registerDto);
    }

    const user = this.userRepository.create({ id: account.id, account });
    await this.userRepository.save(user);
  }

  async registerDriver(register: RegisterDriverDto) {
    //todo: gửi mã xác nhận qua phone
    let account = await this.accountRepository.findOneByPhone(register.phone, [
      'roles',
      'driver',
    ]);
    const isExist = account?.isActivatedDriver();
    if (isExist) throw new PhoneNumberAlreadyExistsException(register.phone);
    if (account?.driver?.activateStatus === ActivateStatus.DEACTIVATED)
      throw new DriverRegisterIsPending(register.phone);
    if (account) {
      const isMatch = await this.bcryptService.compare(
        register.password,
        account.password,
      );
      const roleLength = account.roles.length;
      if (!isMatch && roleLength)
        throw new PasswordIncorrectForAlreadyEmailException();
      // Nếu tài khoản chưa có role nào thì cập nhật lại thông tin đăng ký
      if (roleLength === 0) {
        register.password = await this.bcryptService.hash(register.password);
        this.accountRepository.merge(account, register);
      }
    } else {
      // Nếu chưa tồn tại tài khoản thì tạo mới
      register.password = await this.bcryptService.hash(register.password);
      account = this.accountRepository.create(register);
    }
    let driver = await this.driverRepository.findOneByPhone(register.phone);
    //Tạo thông tin thống kê cho tài xế
    const matchingStatistic =
      driver?.matchingStatistic ?? this.statisticRepository.create();
    driver = driver ?? this.driverRepository.create();
    this.driverRepository.merge(driver, {
      ...register,
      id: account.id,
      account,
      matchingStatistic,
      activateStatus: ActivateStatus.DEACTIVATED,
    });
    await this.driverRepository.save(driver);
  }

  async registerDriverByUser(
    account: Account,
    register: RegisterDriverByUserDto,
  ) {
    //todo: gửi mã xác nhận qua email
    const existedDriver = await this.driverRepository.findOneByPhone(
      account.phone,
    );
    if (existedDriver) {
      const status = existedDriver.activateStatus;
      if (status === ActivateStatus.ACTIVATED)
        throw new DriverAlreadyExistsException(account.phone);
      if (status === ActivateStatus.DEACTIVATED)
        throw new DriverRegisterIsPending(account.phone);
      // Nếu tài xế đã từng đăng ký nhưng bị từ chối thì cập nhật lại thông tin và chuyển sang trạng thái chờ kích hoạt
      existedDriver.activateStatus = ActivateStatus.DEACTIVATED;
      return await this.driverRepository.save(existedDriver);
    }
    //Tạo thông tin thống kê cho tài xế
    const statistic = this.statisticRepository.create();

    const driverRole = await this.roleRepository.getDriverRole();

    const driver = this.driverRepository.create(register);
    account.roles.push(driverRole);
    driver.account = account;
    driver.matchingStatistic = statistic;
    return await this.driverRepository.save(driver);
  }

  async activeUser(activeUserDto: ActiveUserDto) {
    const { phone, activationCode } = activeUserDto;
    const user = await this.userRepository.findOneByPhone(phone);
    if (!user) throw new UserNotFoundException();
    if (user.isActivated) throw new UserAlreadyActivatedException();
    if (activationCode !== this.ACTIVATION_CODE)
      throw new ActivationIncorrectWrongException();
    const userRole = await this.roleRepository.getUserRole();
    user.account.roles.push(userRole);
    user.isActivated = true;
    await this.userRepository.save(user);
  }

  async activeDriver(activeUserDto: ActionDriverDto) {
    const { phone, active } = activeUserDto;
    const driver = await this.driverRepository.findOneByPhone(phone);
    if (!driver) throw new DriverNotFoundException();
    if (driver.activateStatus === ActivateStatus.ACTIVATED)
      throw new DriverAlreadyActivatedException();
    if (active) {
      const driverRole = await this.roleRepository.getDriverRole();
      driver.activateStatus = ActivateStatus.ACTIVATED;
      driver.account.roles.push(driverRole);
    } else {
      driver.activateStatus = ActivateStatus.REJECTED;
    }
    await this.driverRepository.save(driver);
  }

  @Cron('0 0 */24 * * *')
  async cleanLicensesTable() {
    await this.adminRepository.query('call clean_licenses_table()');
  }
}
