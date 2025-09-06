import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DoctorService, Doctor } from './doctor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('doctors')
@UseGuards(JwtAuthGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  create(@Body() createDoctorDto: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('specialty') specialty?: string,
    @Query('location') location?: string,
    @Query('available') available?: string
  ) {
    const availableBool = available === 'true' ? true : available === 'false' ? false : undefined;
    return this.doctorService.findAll(search, specialty, location, availableBool);
  }

  @Get('available')
  findAvailable() {
    return this.doctorService.findAvailable();
  }

  @Get('specialties')
  getSpecialties() {
    return this.doctorService.getSpecialties();
  }

  @Get('locations')
  getLocations() {
    return this.doctorService.getLocations();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: Partial<Doctor>) {
    return this.doctorService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const deleted = this.doctorService.delete(+id);
    return { success: deleted, message: deleted ? 'Doctor deleted successfully' : 'Doctor not found' };
  }
}
