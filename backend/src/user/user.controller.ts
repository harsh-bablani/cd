import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService, CreateUserDto, UpdateUserDto, User } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    // Only admin can create users
    if (req.user.role !== 'admin') {
      return { success: false, message: 'Only admin can create users' };
    }
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    // Only admin can view all users
    if (req.user.role !== 'admin') {
      return { success: false, message: 'Only admin can view all users' };
    }
    return this.userService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.userService.findOne(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    // Users can only view their own profile, admin can view any
    if (req.user.role !== 'admin' && req.user.userId !== +id) {
      return { success: false, message: 'Access denied' };
    }
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    // Users can only update their own profile, admin can update any
    if (req.user.role !== 'admin' && req.user.userId !== +id) {
      return { success: false, message: 'Access denied' };
    }
    return this.userService.update(+id, updateUserDto);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard)
  updatePassword(@Param('id') id: string, @Body() body: { currentPassword: string; newPassword: string }, @Request() req) {
    // Users can only update their own password
    if (req.user.userId !== +id) {
      return { success: false, message: 'Access denied' };
    }
    return this.userService.updatePassword(+id, body.currentPassword, body.newPassword);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    // Only admin can delete users
    if (req.user.role !== 'admin') {
      return { success: false, message: 'Only admin can delete users' };
    }
    return this.userService.delete(+id);
  }
}
