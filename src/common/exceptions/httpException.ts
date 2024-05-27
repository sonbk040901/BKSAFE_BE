import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class PhoneOrPasswordIncorrectException extends UnauthorizedException {
  constructor() {
    super('Phone or password is incorrect 🤕!');
  }
}

export class PasswordIncorrectForAlreadyEmailException extends UnauthorizedException {
  constructor() {
    super('Password is incorrect for already email 🤕!');
  }
}

export class PhoneNumberAlreadyExistsException extends ConflictException {
  constructor(phone: string) {
    super(`Phone ${phone} already exists 🤯!`);
  }
}

export class DriverAlreadyExistsException extends ConflictException {
  constructor(phone: string) {
    super(`Driver ${phone} already exists 😡!`);
  }
}

export class DriverRegisterIsPending extends ConflictException {
  constructor(phone: string) {
    super(`Driver register for ${phone} is pending 😡!`);
  }
}

export class NotCompletedBookingAlreadyExistsException extends ConflictException {
  constructor() {
    super('You have a booking not completed 😡!');
  }
}

export class BookingNotFoundException extends NotFoundException {
  constructor() {
    super('Booking not found 🧐!');
  }
}

export class DriverNotFoundException extends NotFoundException {
  constructor() {
    super('Driver not found 🧐!');
  }
}

export class AccessDeniedException extends UnauthorizedException {
  constructor() {
    super('Access denied 🛑!');
  }
}

export class JwtTokenExpiredException extends UnauthorizedException {
  constructor() {
    super('Token expired');
  }
}

export class JwtTokenInvalidException extends UnauthorizedException {
  constructor() {
    super('Token invalid');
  }
}

export class ActivationIncorrectWrongException extends UnauthorizedException {
  constructor() {
    super('Activation code is incorrect 🤕!');
  }
}

export class UserAlreadyActivatedException extends ConflictException {
  constructor() {
    super('User already activated 😡!');
  }
}

export class DriverAlreadyActivatedException extends ConflictException {
  constructor() {
    super('Driver already activated 😡!');
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User not found 🧐!');
  }
}

export class AccountNotActivatedException extends ConflictException {
  constructor() {
    super('Account not activated 😡!');
  }
}
