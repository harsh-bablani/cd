import { Injectable } from '@nestjs/common';

export interface QueuePatient {
  id: number;
  queueNumber: number;
  patientName: string;
  patientId?: number;
  priority: 'high' | 'normal' | 'low';
  estimatedWait: number;
  status: 'waiting' | 'with-doctor' | 'completed' | 'cancelled';
  doctorId?: number;
  checkInTime: string;
  updatedAt: string;
}

@Injectable()
export class QueueService {
  private queue: QueuePatient[] = [
    {
      id: 1,
      queueNumber: 1,
      patientName: 'Alice Johnson',
      patientId: 1,
      priority: 'high',
      estimatedWait: 15,
      status: 'waiting',
      checkInTime: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 2,
      queueNumber: 2,
      patientName: 'Bob Wilson',
      patientId: 2,
      priority: 'normal',
      estimatedWait: 30,
      status: 'waiting',
      checkInTime: '2024-01-15T09:15:00Z',
      updatedAt: '2024-01-15T09:15:00Z'
    },
    {
      id: 3,
      queueNumber: 3,
      patientName: 'Carol Davis',
      patientId: 3,
      priority: 'low',
      estimatedWait: 45,
      status: 'waiting',
      checkInTime: '2024-01-15T09:30:00Z',
      updatedAt: '2024-01-15T09:30:00Z'
    },
  ];

  private nextQueueNumber = 4;

  findAll() {
    return this.queue.sort((a, b) => {
      // Sort by priority first, then by queue number
      const priorityOrder = { high: 1, normal: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.queueNumber - b.queueNumber;
    });
  }

  findOne(id: number): QueuePatient | undefined {
    return this.queue.find(patient => patient.id === id);
  }

  findByStatus(status: string): QueuePatient[] {
    return this.queue.filter(patient => patient.status === status);
  }

  addToQueue(patientData: Omit<QueuePatient, 'id' | 'queueNumber' | 'estimatedWait' | 'status' | 'checkInTime' | 'updatedAt'>): QueuePatient {
    const newPatient: QueuePatient = {
      id: this.queue.length + 1,
      queueNumber: this.nextQueueNumber++,
      ...patientData,
      status: 'waiting',
      estimatedWait: this.calculateWaitTime(),
      checkInTime: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.queue.push(newPatient);
    return newPatient;
  }

  updateStatus(id: number, status: QueuePatient['status'], doctorId?: number): QueuePatient | null {
    const index = this.queue.findIndex(patient => patient.id === id);
    if (index !== -1) {
      this.queue[index] = {
        ...this.queue[index],
        status,
        doctorId: doctorId || this.queue[index].doctorId,
        updatedAt: new Date().toISOString()
      };
      return this.queue[index];
    }
    return null;
  }

  removeFromQueue(id: number): boolean {
    const index = this.queue.findIndex(patient => patient.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  getQueueStats() {
    const total = this.queue.length;
    const waiting = this.queue.filter(p => p.status === 'waiting').length;
    const withDoctor = this.queue.filter(p => p.status === 'with-doctor').length;
    const completed = this.queue.filter(p => p.status === 'completed').length;
    const avgWaitTime = total > 0 ? Math.round(this.queue.reduce((acc, p) => acc + p.estimatedWait, 0) / total) : 0;

    return {
      total,
      waiting,
      withDoctor,
      completed,
      avgWaitTime
    };
  }

  private calculateWaitTime(): number {
    const waitingPatients = this.queue.filter(p => p.status === 'waiting');
    return waitingPatients.length * 15; // 15 minutes per patient
  }
}
