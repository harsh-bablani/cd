'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, UserCheck, Plus, Search, LogOut, UserPlus, Edit, Trash2, RefreshCw, X, Check } from 'lucide-react';
import AuthForm from './AuthForm';
import PatientForm from './PatientForm';
import AppointmentForm from './AppointmentForm';

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
  createdAt: string;
  updatedAt: string;
}

interface Appointment {
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

interface QueuePatient {
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

interface Patient {
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

export default function HomeContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueuePatient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Get API base URL from environment or default to localhost
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  // Initialize arrays to prevent filter errors
  useEffect(() => {
    if (isAuthenticated) {
      setDoctors([]);
      setAppointments([]);
      setQueue([]);
      setPatients([]);
    }
  }, [isAuthenticated]);


  const fetchData = () => {
    fetchDoctors();
    fetchAppointments();
    fetchQueue();
    fetchPatients();
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/queue`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setQueue(data);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const addToQueue = async (patientName: string, priority: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/queue`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ patientName, priority }),
      });
      if (response.ok) {
        fetchQueue();
      }
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  };

  const updateQueueStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/queue/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchQueue();
      }
    } catch (error) {
      console.error('Error updating queue status:', error);
    }
  };

  const removeFromQueue = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/queue/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        fetchQueue();
      }
    } catch (error) {
      console.error('Error removing from queue:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients${searchTerm ? `?search=${searchTerm}` : ''}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const createAppointment = async (appointmentData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(appointmentData),
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        fetchData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (registerData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        fetchData();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setCurrentUser(null);
      setIsAuthenticated(false);
      setActiveTab('dashboard');
    }
  };

  const handlePatientSubmit = async (patientData: Omit<Patient, 'id'>) => {
    setIsLoading(true);
    try {
      const url = editingPatient 
        ? `${API_BASE_URL}/patients/${editingPatient.id}`
        : `${API_BASE_URL}/patients`;
      
      const method = editingPatient ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(patientData),
      });
      
      if (response.ok) {
        fetchPatients();
        setShowPatientForm(false);
        setEditingPatient(null);
      }
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  const handleDeletePatient = async (id: number) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchPatients();
        }
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleAppointmentSubmit = async (appointmentData: Omit<Appointment, 'id'>) => {
    setIsLoading(true);
    try {
      const url = editingAppointment 
        ? `${API_BASE_URL}/appointments/${editingAppointment.id}`
        : `${API_BASE_URL}/appointments`;
      
      const method = editingAppointment ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(appointmentData),
      });
      
      if (response.ok) {
        fetchAppointments();
        setShowAppointmentForm(false);
        setEditingAppointment(null);
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleRescheduleAppointment = async (id: number, newDate: string, newTime: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/reschedule`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ date: newDate, time: newTime }),
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const handleCancelAppointment = async (id: number) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
          method: 'PATCH',
        });
        if (response.ok) {
          fetchAppointments();
        }
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const handleCompleteAppointment = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}/complete`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchAppointments();
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPatients();
    }
  }, [searchTerm, isAuthenticated]);

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center h-auto lg:h-16 py-4 lg:py-0">
            <div className="flex items-center justify-between mb-4 lg:mb-0">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Clinic Front Desk</h1>
              <div className="lg:hidden">
                {currentUser && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">{currentUser.firstName}</span>
                    <span className="ml-1 px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {currentUser.role}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="lg:hidden mb-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 text-xs font-medium rounded-md ${
                    activeTab === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('patients')}
                  className={`px-3 py-2 text-xs font-medium rounded-md ${
                    activeTab === 'patients' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Patients
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-3 py-2 text-xs font-medium rounded-md ${
                    activeTab === 'appointments' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`px-3 py-2 text-xs font-medium rounded-md ${
                    activeTab === 'queue' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Queue
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 text-sm font-medium ${
                  activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-3 py-2 text-sm font-medium ${
                  activeTab === 'patients' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Patients
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-3 py-2 text-sm font-medium ${
                  activeTab === 'appointments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-3 py-2 text-sm font-medium ${
                  activeTab === 'queue' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Queue
              </button>
            </nav>

            {/* User Info and Logout */}
            <div className="flex items-center justify-between lg:gap-4">
              <div className="hidden lg:block">
                {currentUser && (
                  <div className="text-sm text-gray-600">
                    Welcome, <span className="font-medium">{currentUser.firstName} {currentUser.lastName}</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {currentUser.role}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 lg:bg-transparent rounded-md lg:rounded-none"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Available Doctors</dt>
                        <dd className="text-base sm:text-lg font-medium text-gray-900">
                          {Array.isArray(doctors) ? doctors.filter(d => d.available).length : 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Today's Appointments</dt>
                        <dd className="text-base sm:text-lg font-medium text-gray-900">{Array.isArray(appointments) ? appointments.length : 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Queue Length</dt>
                        <dd className="text-base sm:text-lg font-medium text-gray-900">{Array.isArray(queue) ? queue.length : 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-4 sm:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Patients</dt>
                        <dd className="text-base sm:text-lg font-medium text-gray-900">{Array.isArray(patients) ? patients.length : 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h3 className="text-lg font-medium text-gray-900">Appointment Management</h3>
                  <button
                    onClick={() => setShowAppointmentForm(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Schedule Appointment</span>
                    <span className="sm:hidden">Schedule</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(appointments) ? appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div>
                            <div className="font-medium">{appointment.patientName}</div>
                            <div className="sm:hidden text-xs text-gray-500">
                              {Array.isArray(doctors) ? doctors.find(d => d.id === appointment.doctorId)?.name || 'Unknown' : 'Unknown'}
                            </div>
                            <div className="md:hidden text-xs text-gray-500">{appointment.time}</div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Array.isArray(doctors) ? doctors.find(d => d.id === appointment.doctorId)?.name || 'Unknown' : 'Unknown'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(appointment.date).toLocaleDateString()}
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.time}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            appointment.status === 'rescheduled' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleEditAppointment(appointment)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit Appointment"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            {appointment.status === 'scheduled' && (
                              <>
                                <button
                                  onClick={() => handleCompleteAppointment(appointment.id)}
                                  className="text-green-600 hover:text-green-900 p-1"
                                  title="Mark as Completed"
                                >
                                  <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                                <button
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Cancel Appointment"
                                >
                                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Delete Appointment"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          No appointments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h3 className="text-lg font-medium text-gray-900">Patient Management</h3>
                  <button
                    onClick={() => setShowPatientForm(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Patient</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                      <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(patients) ? patients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div>
                            <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                            <div className="sm:hidden text-xs text-gray-500">{patient.email}</div>
                            <div className="md:hidden text-xs text-gray-500">{patient.phone}</div>
                            <div className="lg:hidden text-xs text-gray-500">
                              DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                            </div>
                            <div className="xl:hidden text-xs text-gray-500">Gender: {patient.gender}</div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.email}
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.phone}
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(patient.dateOfBirth).toLocaleDateString()}
                        </td>
                        <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.gender}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleEditPatient(patient)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit Patient"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePatient(patient.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete Patient"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          No patients found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'queue' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <h3 className="text-lg font-medium text-gray-900">Queue Management</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => addToQueue('New Patient', 'normal')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add to Queue</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                    <button
                      onClick={fetchQueue}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Queue #</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
                      <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Wait</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(queue) ? queue.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                          #{patient.queueNumber}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div>
                            <div className="font-medium">{patient.patientName}</div>
                            <div className="sm:hidden text-xs text-gray-500">
                              Priority: <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${
                                patient.priority === 'high' ? 'bg-red-100 text-red-800' :
                                patient.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {patient.priority}
                              </span>
                            </div>
                            <div className="md:hidden text-xs text-gray-500">
                              Check-in: {new Date(patient.checkInTime).toLocaleTimeString()}
                            </div>
                            <div className="lg:hidden text-xs text-gray-500">
                              Wait: {patient.estimatedWait} min
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            patient.priority === 'high' ? 'bg-red-100 text-red-800' :
                            patient.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {patient.priority}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(patient.checkInTime).toLocaleTimeString()}
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.estimatedWait} min
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            patient.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                            patient.status === 'with-doctor' ? 'bg-blue-100 text-blue-800' :
                            patient.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            {patient.status === 'waiting' && (
                              <button
                                onClick={() => updateQueueStatus(patient.id, 'with-doctor')}
                                className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm px-2 py-1 bg-blue-50 rounded sm:bg-transparent"
                              >
                                Call
                              </button>
                            )}
                            {patient.status === 'with-doctor' && (
                              <button
                                onClick={() => updateQueueStatus(patient.id, 'completed')}
                                className="text-green-600 hover:text-green-900 text-xs sm:text-sm px-2 py-1 bg-green-50 rounded sm:bg-transparent"
                              >
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => removeFromQueue(patient.id)}
                              className="text-red-600 hover:text-red-900 text-xs sm:text-sm px-2 py-1 bg-red-50 rounded sm:bg-transparent"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          No patients in queue
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Patient Form Modal */}
      {showPatientForm && (
        <PatientForm
          patient={editingPatient || undefined}
          onSubmit={handlePatientSubmit}
          onCancel={() => {
            setShowPatientForm(false);
            setEditingPatient(null);
          }}
          isLoading={isLoading}
        />
      )}

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <AppointmentForm
          appointment={editingAppointment || undefined}
          doctors={doctors}
          patients={patients}
          onSubmit={handleAppointmentSubmit}
          onCancel={() => {
            setShowAppointmentForm(false);
            setEditingAppointment(null);
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
