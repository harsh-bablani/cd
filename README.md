# 🏥 Clinic Front Desk Management System

A comprehensive clinic management system built with **NestJS** (backend) and **Next.js** (frontend) featuring JWT authentication, appointment scheduling, patient management, and queue management.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT Authentication** with secure token management
- **User Registration & Login** with role-based access
- **Password Hashing** using bcryptjs
- **Protected API Endpoints** with JWT guards
- **Admin & Staff Roles** with different permissions

### 👥 User Management
- **User Registration** with complete profile information
- **Role-based Access Control** (Admin/Staff)
- **User Profile Management**
- **Secure Logout** with token cleanup

### 🏥 Clinic Management
- **Doctor Management**: Add, edit, delete doctors with specialties, locations, and availability
- **Patient Management**: Comprehensive patient records with search functionality
- **Appointment Scheduling**: Book, reschedule, cancel, and complete appointments
- **Queue Management**: Real-time queue with priority handling and status updates
- **Time Slot Management**: Dynamic availability checking

### 📊 Dashboard & Analytics
- **Real-time Dashboard** with key metrics
- **Appointment Statistics**
- **Queue Status Monitoring**
- **Doctor Availability Tracking**

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Passport** - Authentication middleware

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Client-side Rendering** - Optimized for performance

## 📁 Project Structure

```
clinic-front-desk-system/
├── backend/                 # NestJS Backend API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── user/           # User management
│   │   ├── doctor/         # Doctor management
│   │   ├── patient/        # Patient management
│   │   ├── appointment/    # Appointment scheduling
│   │   └── queue/          # Queue management
│   └── package.json
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   └── components/    # Reusable components
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd clinic-front-desk-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start Backend Server**
   ```bash
   cd backend
   npm run start:dev
   ```
   Backend will run on: http://localhost:3001

5. **Start Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on: http://localhost:3000

### Default Login Credentials
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Prepare for Deployment**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   - Push your code to GitHub
   - Connect your GitHub repository to Vercel
   - Configure environment variables
   - Deploy!

### Backend Deployment (Railway/Render/Heroku)

1. **Prepare for Deployment**
   ```bash
   cd backend
   npm run build
   ```

2. **Deploy to Railway/Render**
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy!

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (.env)
```env
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
NODE_ENV=production
```

## 📱 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/profile` - Get user profile

### Doctors
- `GET /doctors` - Get all doctors
- `POST /doctors` - Create doctor
- `PATCH /doctors/:id` - Update doctor
- `DELETE /doctors/:id` - Delete doctor

### Patients
- `GET /patients` - Get all patients
- `POST /patients` - Create patient
- `PATCH /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient

### Appointments
- `GET /appointments` - Get all appointments
- `POST /appointments` - Create appointment
- `PATCH /appointments/:id/reschedule` - Reschedule appointment
- `PATCH /appointments/:id/cancel` - Cancel appointment
- `PATCH /appointments/:id/complete` - Complete appointment

### Queue
- `GET /queue` - Get queue status
- `POST /queue` - Add to queue
- `PATCH /queue/:id/status` - Update queue status
- `DELETE /queue/:id` - Remove from queue

## 🎯 Key Features Explained

### JWT Authentication
- Secure token-based authentication
- Role-based access control
- Automatic token refresh
- Secure logout with token cleanup

### Appointment Management
- Dynamic time slot availability
- Doctor-specific scheduling
- Status tracking (scheduled, completed, cancelled)
- Rescheduling and cancellation

### Queue Management
- Priority-based queue system
- Real-time status updates
- Estimated wait times
- Automatic queue numbering

### Patient Management
- Comprehensive patient profiles
- Search and filter functionality
- Medical history tracking
- Contact information management

## 🚀 Production Deployment Checklist

- [ ] Set up environment variables
- [ ] Configure CORS for production domains
- [ ] Set up database (if needed)
- [ ] Configure JWT secrets
- [ ] Set up SSL certificates
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Test all endpoints
- [ ] Verify authentication flow
- [ ] Test responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Built with ❤️ for modern clinic management**
