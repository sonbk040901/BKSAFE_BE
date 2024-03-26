import { SetMetadata } from '@nestjs/common';

export const PERMIT_KEY = 'isPublic';
export const Permit = () => SetMetadata(PERMIT_KEY, true);
