import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class PhoneOrPasswordIncorrectException extends UnauthorizedException {
  constructor() {
    super('Số điện thoại hoặc mật khẩu không chính xác 🤕!');
  }
}

export class PasswordIncorrectForAlreadyPhoneException extends UnauthorizedException {
  constructor() {
    super('Mật khẩu không khớp với tài khoản người dùng 🤕!');
  }
}

export class PhoneNumberAlreadyExistsException extends ConflictException {
  constructor(phone: string) {
    super(`Số điện thoại ${phone} đã tồn tại 🤯!`);
  }
}

export class DriverAlreadyExistsException extends ConflictException {
  constructor(phone: string) {
    super(`Tài xế ${phone} đã tồn tại 😡!`);
  }
}

export class DriverRegisterIsPending extends ConflictException {
  constructor(phone: string) {
    super(
      `Đơn đăng ký làm tài xế cho số điện thoại ${phone} đang chờ xử lý 😡!`,
    );
  }
}

export class DriverRegisterIsAlreadyAccepted extends ConflictException {
  constructor(phone: string) {
    super(
      `Đơn đăng ký làm tài xế cho số điện thoại ${phone} đã được duyệt 😡!`,
    );
  }
}

export class NotCompletedBookingAlreadyExistsException extends ConflictException {
  constructor() {
    super('Bạn vẫn còn một chuyến đi chưa hoàn thành 😡!');
  }
}

export class BookingNotFoundException extends NotFoundException {
  constructor() {
    super('Không tìm thấy chuyến đi🧐!');
  }
}

export class DriverNotFoundException extends NotFoundException {
  constructor() {
    super('Tài xế không tồn tại🧐!');
  }
}

export class AccessDeniedException extends UnauthorizedException {
  constructor() {
    super('Không được phép truy cập🛑!');
  }
}

export class JwtTokenExpiredException extends UnauthorizedException {
  constructor() {
    super('Token expired');
  }
}

export class JwtTokenInvalidException extends UnauthorizedException {
  constructor() {
    super('Token không hợp lệ');
  }
}

export class ActivationIncorrectWrongException extends UnauthorizedException {
  constructor() {
    super('Sai mã xác thực 🤕!');
  }
}

export class UserAlreadyActivatedException extends ConflictException {
  constructor() {
    super('Tài khoản người dùng đã kích hoạt 😡!');
  }
}

export class DriverAlreadyActivatedException extends ConflictException {
  constructor() {
    super('Tài khoản tài xế đã kích hoạt 😡!');
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('Người dùng không tồn tại 🧐!');
  }
}

export class AccountNotActivatedException extends ConflictException {
  constructor() {
    super('Tài khoản chưa xác thực 😡!');
  }
}
