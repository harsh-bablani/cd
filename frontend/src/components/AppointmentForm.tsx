'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText } from 'lucide-react';

interface Doctor {
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
}

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Appointment {
  id?: number;
  patientName: string;
  patientId?: number;
  doctorId: number;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

interface AppointmentFormProps {
  appointment?: Appointment;
  doctors: Doctor[];
  patients: Patient[];
  onSubmit: (appointment: Omit<Appointment, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AppointmentForm({ 
  appointment, 
  doctors, 
  patients, 
  onSubmit, 
  onCancel, 
  isLoading 
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<Omit<Appointment, 'id'>>(
    appointment || {
      patientName: '',
      patientId: undefined,
      doctorId: 0,
      date: '',
      time: '',
      status: 'scheduled',
      notes: ''
    }
  );

  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Fetch available time slots when doctor or date changes
  useEffect(() => {
    if (formData.doctorId && formData.date) {
      fetchAvailableTimeSlots(formData.doctorId, formData.date);
    }
  }, [formData.doctorId, formData.date]);

  const fetchAvailableTimeSlots = async (doctorId: number, date: string) => {
    try {
      const response = await fetch(`https://cd-ru8a.onrender.com/appointments/time-slots?doctorId=${doctorId}&date=${date}`);
      const slots = await response.json();
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setAvailableTimeSlots([]);
    }
  };

  const handleInputChange = (field: keyof Omit<Appointment, 'id'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // If patient is selected, update patient name
    if (field === 'patientId' && value) {
      const patient = patients.find(p => p.id === value);
      if (patient) {
        setSelectedPatient(patient);
        setFormData(prev => ({
          ...prev,
          patientName: `${patient.firstName} ${patient.lastName}`,
          patientId: patient.id
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedDoctor = doctors.find(d => d.id === formData.doctorId);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {appointment ? 'Edit Appointment' : 'Schedule New Appointment'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Patient Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Select Patient</label>
                <select
                  value={formData.patientId || ''}
                  onChange={(e) => handleInputChange('patientId', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} - {patient.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Patient name will auto-fill when selected"
                  required
                />
              </div>
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Doctor Information
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
              <select
                value={formData.doctorId}
                onChange={(e) => handleInputChange('doctorId', parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={0}>Choose a doctor...</option>
                {doctors.filter(d => d.available).map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty} ({doctor.location})
                  </option>
                ))}
              </select>
              {selectedDoctor && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {selectedDoctor.name}<br/>
                    <strong>Specialty:</strong> {selectedDoctor.specialty}<br/>
                    <strong>Location:</strong> {selectedDoctor.location}<br/>
                    <strong>Working Hours:</strong> {selectedDoctor.workingHours.start} - {selectedDoctor.workingHours.end}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Appointment Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <select
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!formData.doctorId || !formData.date}
                >
                  <option value="">Select time...</option>
                  {availableTimeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {formData.doctorId && formData.date && availableTimeSlots.length === 0 && (
                  <p className="mt-1 text-sm text-red-600">No available time slots for this date</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Additional Information
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any notes about the appointment..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.doctorId || !formData.date || !formData.time}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (appointment ? 'Update Appointment' : 'Schedule Appointment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
