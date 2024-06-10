import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthPayload } from './interfaces/auth-payload.interface';
import {
  AccountNotActivatedException,
  ActivationIncorrectWrongException,
  DriverAlreadyExistsException,
  DriverRegisterIsPending,
  PhoneNumberAlreadyExistsException,
  PhoneOrPasswordIncorrectException,
  UserAlreadyActivatedException,
  UserNotFoundException,
} from '~/common/exceptions/httpException';
import { BcryptService } from '~utils/bcrypt.service';
import { DriverRepository } from '~repos/driver.repository';
import { RegisterStatus } from '~entities/driver.entity';
import { UserRepository } from '~repos/user.repository';
import { Account, ActivateStatus } from '~entities/account.entity';
import { RegisterDriverByUserDto } from '@auth/dto/register-driver-by-user.dto';
import { AdminRepository } from '~repos/admin.repository';
import { ActiveUserDto } from '@auth/dto/active-user.dto';
import { BaseAccountService } from '~/common/gateway/base-account.service';
import { RoleName } from '~/common/enums/role-name.enum';
import { IAuthVerify } from '~interfaces/auth-verify.interface';

@Injectable()
export class AuthService extends BaseAccountService implements IAuthVerify {
  private readonly ACTIVATION_CODE = '20194658';

  constructor(
    driverRepository: DriverRepository,
    userRepository: UserRepository,
    adminRepository: AdminRepository,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {
    super(userRepository, driverRepository, adminRepository);
  }

  async verify(token: string) {
    const { id, role } = this.jwtService.verify<AuthPayload>(token);
    const repo = this.getAccountRepository(role);
    const account = await repo.findOne({ where: { id } });
    if (!account) throw new PhoneOrPasswordIncorrectException();
    return account;
  }

  async login(loginDto: LoginDto, role: RoleName = RoleName.USER) {
    const account = await this.getAccountRepository(role).findOneByPhone(
      loginDto.phone,
    );
    if (!account) throw new PhoneOrPasswordIncorrectException();
    if (!account.isActivated()) throw new AccountNotActivatedException();
    if (account.isDriver() && !account.isRegisterStatusAccepted())
      throw new AccountNotActivatedException();

    const isMatch = await this.bcryptService.compare(
      loginDto.password,
      account.password,
    );
    if (!isMatch) throw new PhoneOrPasswordIncorrectException();

    const payload: AuthPayload = {
      id: account.id,
      role,
    };
    return this.jwtService.sign(payload);
  }

  async register(registerDto: RegisterDto, role: RoleName = RoleName.USER) {
    const accRepo = this.getAccountRepository(role);
    let account = await accRepo.findOneByPhone(registerDto.phone);
    if (account?.isDriver() && account.isRegisterStatusAccepted())
      throw new DriverAlreadyExistsException(registerDto.phone);
    else if (account && !account.isPending())
      throw new PhoneNumberAlreadyExistsException(registerDto.phone);
    const hashedPassword = await this.bcryptService.hash(registerDto.password);
    if (!account)
      account = accRepo.create({ ...registerDto, password: hashedPassword });
    //todo: merge account
    if (account.isDriver() && !account.isRegisterStatusAccepted()) {
      account.registerStatus = RegisterStatus.PENDING;
    }
    return await accRepo.save(account);
    //todo: gửi mã xác nhận qua phone
  }

  async registerDriverByUser(
    account: Account,
    register: RegisterDriverByUserDto,
  ) {
    const existedDriver = await this.driverRepository.findOneByPhone(
      account.phone,
    );
    if (existedDriver) {
      const status = existedDriver.registerStatus;
      if (status === RegisterStatus.ACCEPTED)
        throw new DriverAlreadyExistsException(account.phone);
      if (status === RegisterStatus.PENDING)
        throw new DriverRegisterIsPending(account.phone);
      // Nếu tài xế đã từng đăng ký nhưng bị từ chối thì cập nhật lại thông tin và chuyển sang trạng thái chờ kích hoạt
      existedDriver.registerStatus = RegisterStatus.PENDING;
      return this.driverRepository.save(existedDriver);
    }

    const driver = this.driverRepository.create(register);
    // Bỏ qua bước kích hoạt tài khoản cho tài xế
    driver.activateStatus = ActivateStatus.ACTIVATED;
    return this.driverRepository.save(driver);
  }

  async active(
    activeUserDto: ActiveUserDto,
    role: Exclude<RoleName, 'ADMIN'> = RoleName.USER,
  ) {
    const accRepo = this.getAccountRepository(role);
    const { phone, activationCode } = activeUserDto;
    const account = await accRepo.findOneByPhone(phone);
    if (!account) throw new UserNotFoundException();
    if (account.isActivated()) throw new UserAlreadyActivatedException();
    if (activationCode !== this.ACTIVATION_CODE)
      throw new ActivationIncorrectWrongException();
    account.activateStatus = ActivateStatus.ACTIVATED;
    await accRepo.save(account);
  }

  // @Cron('0 0 */24 * * *')
  // async cleanLicensesTable() {
  //   await this.adminRepository.query('call clean_licenses_table()');
  // }
}
