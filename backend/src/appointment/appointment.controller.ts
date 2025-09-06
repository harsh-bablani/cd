import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AppointmentService, Appointment } from './appointment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() createAppointmentDto: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  findAll(@Query('doctorId') doctorId?: string, @Query('date') date?: string) {
    if (doctorId) {
      return this.appointmentService.findByDoctor(+doctorId);
    }
    if (date) {
      return this.appointmentService.findByDate(date);
    }
    return this.appointmentService.findAll();
  }

  @Get('time-slots')
  getAvailableTimeSlots(@Query('doctorId') doctorId: string, @Query('date') date: string) {
    return this.appointmentService.getAvailableTimeSlots(+doctorId, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppointmentDto: Partial<Appointment>) {
    return this.appointmentService.update(+id, updateAppointmentDto);
  }

  @Patch(':id/reschedule')
  reschedule(@Param('id') id: string, @Body() body: { date: string; time: string }) {
    return this.appointmentService.reschedule(+id, body.date, body.time);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.appointmentService.cancel(+id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.appointmentService.complete(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const deleted = this.appointmentService.delete(+id);
    return { success: deleted, message: deleted ? 'Appointment deleted successfully' : 'Appointment not found' };
  }
}
