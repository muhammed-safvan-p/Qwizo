import { User } from '../../../authentication/domain/entities/User.js';

export interface LoginInputDto {
  email: string;
  password: string;
}

export interface LoginOutputDto {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
}
