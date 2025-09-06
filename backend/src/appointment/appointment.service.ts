import { Injectable } from '@nestjs/common';

export interface Appointment {
  id: number;
  patientName: string;
  patientId?: number;
  doctorId: number;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class AppointmentService {
  private appointments: Appointment[] = [
    {
      id: 1,
      patientName: 'John Doe',
      patientId: 1,
      doctorId: 1,
      date: '2024-01-15',
      time: '10:00',
      status: 'scheduled',
      notes: 'Regular checkup',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      patientId: 2,
      doctorId: 2,
      date: '2024-01-15',
      time: '11:00',
      status: 'completed',
      notes: 'Cardiology consultation',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
  ];

  findAll() {
    return this.appointments;
  }

  findOne(id: number): Appointment | undefined {
    return this.appointments.find(appointment => appointment.id === id);
  }

  findByDoctor(doctorId: number): Appointment[] {
    return this.appointments.filter(appointment => appointment.doctorId === doctorId);
  }

  findByDate(date: string): Appointment[] {
    return this.appointments.filter(appointment => appointment.date === date);
  }

  create(createAppointmentDto: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment {
    const newAppointment: Appointment = {
      id: this.appointments.length + 1,
      ...createAppointmentDto,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  update(id: number, updateAppointmentDto: Partial<Appointment>): Appointment | null {
    const index = this.appointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      this.appointments[index] = {
        ...this.appointments[index],
        ...updateAppointmentDto,
        updatedAt: new Date().toISOString()
      };
      return this.appointments[index];
    }
    return null;
  }

  reschedule(id: number, newDate: string, newTime: string): Appointment | null {
    const appointment = this.findOne(id);
    if (appointment && appointment.status === 'scheduled') {
      return this.update(id, {
        date: newDate,
        time: newTime,
        status: 'rescheduled'
      });
    }
    return null;
  }

  cancel(id: number): Appointment | null {
    const appointment = this.findOne(id);
    if (appointment && appointment.status === 'scheduled') {
      return this.update(id, { status: 'cancelled' });
    }
    return null;
  }

  complete(id: number): Appointment | null {
    const appointment = this.findOne(id);
    if (appointment && appointment.status === 'scheduled') {
      return this.update(id, { status: 'completed' });
    }
    return null;
  }

  getAvailableTimeSlots(doctorId: number, date: string): string[] {
    const allTimeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    const bookedSlots = this.appointments
      .filter(appointment => 
        appointment.doctorId === doctorId && 
        appointment.date === date && 
        appointment.status === 'scheduled'
      )
      .map(appointment => appointment.time);

    return allTimeSlots.filter(slot => !bookedSlots.includes(slot));
  }

  delete(id: number): boolean {
    const index = this.appointments.findIndex(appointment => appointment.id === id);
    if (index !== -1) {
      this.appointments.splice(index, 1);
      return true;
    }
    return false;
  }
}
