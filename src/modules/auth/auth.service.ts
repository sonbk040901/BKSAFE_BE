import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AccountRepository } from '~repos/account.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthPayload } from './interfaces/auth-payload.interface';
import {
  DriverAlreadyExistsException,
  DriverRegisterIsPending,
  EmailAlreadyExistsException,
  EmailOrPasswordIncorrectException,
  PasswordIncorrectForAlreadyEmailException,
} from '~/common/exceptions/httpException';
import { BcryptService } from '~utils/bcrypt.service';
import { RegisterDriverDto } from '@auth/dto/register-driver.dto';
import { DriverRepository } from '~repos/driver.repository';
import { RoleRepository } from '~repos/role.repository';
import { ActivateStatus } from '~entities/driver.entity';
import { UserRepository } from '~repos/user.repository';
import { Account } from '~entities/account.entity';
import { RegisterDriverByUserDto } from '@auth/dto/register-driver-by-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private accountRepository: AccountRepository,
    private driverRepository: DriverRepository,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async verify(token: string) {
    const { id } = this.jwtService.verify<AuthPayload>(token);
    const user = await this.accountRepository.findOneBy({ id });
    if (!user) throw new EmailOrPasswordIncorrectException();
    return user;
  }

  async register(registerDto: RegisterDto) {
    //todo: gửi mã xác nhận qua email
    let account = await this.accountRepository.findOneByEmail(
      registerDto.email,
      ['roles'],
    );
    const isExist = account?.roles.some((role) => role.name === 'user');
    if (isExist) throw new EmailAlreadyExistsException(registerDto.email);

    const userRole = await this.roleRepository.getUserRole();
    // Nếu đã tồn tại tài khoản role khác rồi thì sẽ chỉ thêm role user
    if (account) {
      const isMatch = await this.bcryptService.compare(
        registerDto.password,
        account.password,
      );
      if (!isMatch) throw new PasswordIncorrectForAlreadyEmailException();
      account.roles.push(userRole);
    } else {
      // Nếu chưa tồn tại tài khoản thì tạo mới
      registerDto.password = await this.bcryptService.hash(
        registerDto.password,
      );
      account = this.accountRepository.create(registerDto);
      account.roles = [userRole];
    }

    const user = this.userRepository.create({ account });
    await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.accountRepository.findOneByEmail(loginDto.email);
    if (!user) throw new EmailOrPasswordIncorrectException();

    const isMatch = await this.bcryptService.compare(
      loginDto.password,
      user.password,
    );
    if (!isMatch) throw new EmailOrPasswordIncorrectException();

    const payload: AuthPayload = {
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }

  async registerDriver(register: RegisterDriverDto) {
    //todo: gửi mã xác nhận qua email
    const isExist = await this.accountRepository.findOneByEmail(register.email);
    if (isExist) throw new EmailAlreadyExistsException(register.email);

    const driverRole = await this.roleRepository.getDriverRole();
    register.password = await this.bcryptService.hash(register.password);
    const account = this.accountRepository.create(register);
    account.roles
      ? account.roles.push(driverRole)
      : (account.roles = [driverRole]);
    const driver = this.driverRepository.create(register);
    driver.account = account;
    await this.driverRepository.save(driver);
    return account;
  }

  async registerDriverByUser(
    account: Account,
    register: RegisterDriverByUserDto,
  ) {
    //todo: gửi mã xác nhận qua email
    const existedDriver = await this.driverRepository.findOneByEmail(
      account.email,
    );
    if (existedDriver) {
      const status = existedDriver.activateStatus;
      if (status === ActivateStatus.ACTIVATED)
        throw new DriverAlreadyExistsException(account.email);
      if (status === ActivateStatus.DEACTIVATED)
        throw new DriverRegisterIsPending(account.email);
      // Nếu tài xế đã từng đăng ký nhưng bị từ chối thì cập nhật lại thông tin và chuyển sang trạng thái chờ kích hoạt
      existedDriver.activateStatus = ActivateStatus.DEACTIVATED;
      return await this.driverRepository.save(existedDriver);
    }

    const driverRole = await this.roleRepository.getDriverRole();

    const driver = this.driverRepository.create(register);
    account.roles.push(driverRole);
    driver.account = account;
    return await this.driverRepository.save(driver);
  }
}
