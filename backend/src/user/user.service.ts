import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'staff';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'staff';
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'staff';
  isActive?: boolean;
}

@Injectable()
export class UserService {
  private users: (User & { password: string })[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@clinic.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  private nextId = 2;

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username already exists
    const existingUser = this.users.find(user => user.username === createUserDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists
    const existingEmail = this.users.find(user => user.email === createUserDto.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser: User & { password: string } = {
      id: this.nextId++,
      username: createUserDto.username,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role || 'staff',
      isActive: true,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.push(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async findAll(): Promise<User[]> {
    return this.users.map(({ password, ...user }) => user);
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = this.users.find(user => user.id === id);
    if (!user) return undefined;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByUsername(username: string): Promise<(User & { password: string }) | undefined> {
    return this.users.find(user => user.username === username);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);
    if (!user) return undefined;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and already exists
    if (updateUserDto.email) {
      const existingEmail = this.users.find(user => user.email === updateUserDto.email && user.id !== id);
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date().toISOString()
    };

    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  async updatePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.updatedAt = new Date().toISOString();
  }

  async delete(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    // Prevent deleting the admin user
    if (this.users[userIndex].role === 'admin') {
      throw new ConflictException('Cannot delete admin user');
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
