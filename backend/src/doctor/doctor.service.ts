import { Injectable } from '@nestjs/common';

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  gender: 'male' | 'female' | 'other';
  location: string;
  available: boolean;
  email: string;
  phone: string;
  workingHours: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class DoctorService {
  private doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Smith',
      specialty: 'General Medicine',
      gender: 'male',
      location: 'Floor 1, Room 101',
      available: true,
      email: 'dr.smith@clinic.com',
      phone: '+1-555-0101',
      workingHours: { start: '09:00', end: '17:00' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Dr. Johnson',
      specialty: 'Cardiology',
      gender: 'female',
      location: 'Floor 2, Room 201',
      available: true,
      email: 'dr.johnson@clinic.com',
      phone: '+1-555-0102',
      workingHours: { start: '08:00', end: '16:00' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 3,
      name: 'Dr. Williams',
      specialty: 'Pediatrics',
      gender: 'female',
      location: 'Floor 1, Room 103',
      available: false,
      email: 'dr.williams@clinic.com',
      phone: '+1-555-0103',
      workingHours: { start: '10:00', end: '18:00' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
  ];

  findAll(search?: string, specialty?: string, location?: string, available?: boolean): Doctor[] {
    let filteredDoctors = [...this.doctors];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredDoctors = filteredDoctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchLower) ||
        doctor.specialty.toLowerCase().includes(searchLower) ||
        doctor.location.toLowerCase().includes(searchLower)
      );
    }

    if (specialty) {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.specialty === specialty);
    }

    if (location) {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.location === location);
    }

    if (available !== undefined) {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.available === available);
    }

    return filteredDoctors;
  }

  findOne(id: number): Doctor | undefined {
    return this.doctors.find(doctor => doctor.id === id);
  }

  findAvailable(): Doctor[] {
    return this.doctors.filter(doctor => doctor.available);
  }

  create(createDoctorDto: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Doctor {
    const newDoctor: Doctor = {
      id: this.doctors.length + 1,
      ...createDoctorDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.doctors.push(newDoctor);
    return newDoctor;
  }

  update(id: number, updateDoctorDto: Partial<Doctor>): Doctor | null {
    const index = this.doctors.findIndex(doctor => doctor.id === id);
    if (index !== -1) {
      this.doctors[index] = {
        ...this.doctors[index],
        ...updateDoctorDto,
        updatedAt: new Date().toISOString()
      };
      return this.doctors[index];
    }
    return null;
  }

  delete(id: number): boolean {
    const index = this.doctors.findIndex(doctor => doctor.id === id);
    if (index !== -1) {
      this.doctors.splice(index, 1);
      return true;
    }
    return false;
  }

  getSpecialties(): string[] {
    const specialties = [...new Set(this.doctors.map(doctor => doctor.specialty))];
    return specialties.sort();
  }

  getLocations(): string[] {
    const locations = [...new Set(this.doctors.map(doctor => doctor.location))];
    return locations.sort();
  }
}
