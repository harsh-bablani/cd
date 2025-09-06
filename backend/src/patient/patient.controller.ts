import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PatientService, Patient } from './patient.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() createPatientDto: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    const patients = this.patientService.findAll();
    if (search) {
      const searchLower = search.toLowerCase();
      return patients.filter(patient => 
        patient.firstName.toLowerCase().includes(searchLower) ||
        patient.lastName.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower) ||
        patient.phone.includes(search)
      );
    }
    return patients;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: Partial<Patient>) {
    return this.patientService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const deleted = this.patientService.delete(+id);
    return { success: deleted, message: deleted ? 'Patient deleted successfully' : 'Patient not found' };
  }
}
