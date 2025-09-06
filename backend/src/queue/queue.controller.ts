import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UseGuards } from '@nestjs/common';
import { QueueService, QueuePatient } from './queue.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  addToQueue(@Body() patientData: Omit<QueuePatient, 'id' | 'queueNumber' | 'estimatedWait' | 'status' | 'checkInTime' | 'updatedAt'>) {
    return this.queueService.addToQueue(patientData);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    if (status) {
      return this.queueService.findByStatus(status);
    }
    return this.queueService.findAll();
  }

  @Get('stats')
  getQueueStats() {
    return this.queueService.getQueueStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queueService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: QueuePatient['status']; doctorId?: number }) {
    return this.queueService.updateStatus(+id, body.status, body.doctorId);
  }

  @Delete(':id')
  removeFromQueue(@Param('id') id: string) {
    const removed = this.queueService.removeFromQueue(+id);
    return { success: removed, message: removed ? 'Patient removed from queue' : 'Patient not found' };
  }
}
