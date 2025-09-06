import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService, User } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    return await this.userService.validateUser(username, password);
  }

  async login(user: User) {
    const payload = { 
      username: user.username, 
      userId: user.id,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }

  async register(registerData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'admin' | 'staff';
  }) {
    const user = await this.userService.create(registerData);
    return this.login(user);
  }
}
