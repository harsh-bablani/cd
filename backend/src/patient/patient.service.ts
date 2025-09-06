import { Injectable } from '@nestjs/common';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class PatientService {
  private patients: Patient[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      dateOfBirth: '1985-03-15',
      gender: 'male',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1-555-0124'
      },
      medicalHistory: ['Hypertension', 'Diabetes Type 2'],
      allergies: ['Penicillin', 'Shellfish'],
      medications: ['Metformin', 'Lisinopril'],
      insurance: {
        provider: 'Blue Cross Blue Shield',
        policyNumber: 'BC123456789',
        groupNumber: 'GRP001'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  findAll(): Patient[] {
    return this.patients;
  }

  findOne(id: number): Patient | undefined {
    return this.patients.find(patient => patient.id === id);
  }

  findByEmail(email: string): Patient | undefined {
    return this.patients.find(patient => patient.email === email);
  }

  create(createPatientDto: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient {
    const newPatient: Patient = {
      id: this.patients.length + 1,
      ...createPatientDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.patients.push(newPatient);
    return newPatient;
  }

  update(id: number, updatePatientDto: Partial<Patient>): Patient | null {
    const index = this.patients.findIndex(patient => patient.id === id);
    if (index !== -1) {
      this.patients[index] = {
        ...this.patients[index],
        ...updatePatientDto,
        updatedAt: new Date().toISOString()
      };
      return this.patients[index];
    }
    return null;
  }

  delete(id: number): boolean {
    const index = this.patients.findIndex(patient => patient.id === id);
    if (index !== -1) {
      this.patients.splice(index, 1);
      return true;
    }
    return false;
  }
}
