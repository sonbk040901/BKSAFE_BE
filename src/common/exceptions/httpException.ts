import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class EmailOrPasswordIncorrectException extends UnauthorizedException {
  constructor() {
    super('Email or password is incorrect 🤕!');
  }
}

export class PasswordIncorrectForAlreadyEmailException extends UnauthorizedException {
  constructor() {
    super('Password is incorrect for already email 🤕!');
  }
}

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`Email ${email} already exists 🤯!`);
  }
}

export class DriverAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`Driver ${email} already exists 😡!`);
  }
}

export class DriverRegisterIsPending extends ConflictException {
  constructor(email: string) {
    super(`Driver register for ${email} is pending 😡!`);
  }
}

export class NotCompletedBookingAlreadyExistsException extends ConflictException {
  constructor() {
    super('You have a booking not completed 😡!');
  }
}

export class BookingNotFoundException extends NotFoundException {
  constructor() {
    super('Booking not found!');
  }
}

export class DriverNotFoundException extends NotFoundException {
  constructor() {
    super('Driver not found!');
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
