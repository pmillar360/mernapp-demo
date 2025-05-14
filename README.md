# Hotel Booking Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for hotel bookings with modern features and a sleek user interface.

## 🌟 Key Features

- **User Authentication** - Secure login and registration using JWT and HTTP cookies
- **Hotel Management** - Add, edit, and manage hotel listings with detailed information
- **Image Uploads** - Support for hotel image uploads using Cloudinary
- **Search & Filter System** - Advanced search functionality with filters for:
  - Hotel types
  - Star ratings
  - Facilities
  - Price range
- **Online Payments** - Secure payment processing with Stripe integration
- **Booking Management** - View and manage hotel bookings
- **Dynamic Home Page** - Showcasing recently added hotels
- **Responsive Design** - Built with TailwindCSS for a modern, mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Hook Form
- React Icons
- Stripe Payment Integration
- React Datepicker

### Backend
- Node.js with Express
- TypeScript
- MongoDB (with Mongoose)
- JWT Authentication
- Cloudinary (Image Storage)
- Cookie Parser
- CORS

### Testing
- Playwright for E2E Testing

## 🚀 Getting Started

1. Clone the repository

2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` in the backend directory
   - Create `.env` in the frontend directory

4. Start the development servers:

   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm run dev
   ```

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_API_KEY=your_stripe_api_key
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:7000
VITE_STRIPE_PUB_KEY=your_stripe_public_key
```

## 📚 Project Structure

```
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts
│   │   ├── forms/       # Form components
│   │   ├── pages/       # Page components
│   │   └── layouts/     # Layout components
│   
├── backend/            # Express backend application
│   ├── src/
│   │   ├── models/     # MongoDB models
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Custom middleware
│   │   └── shared/     # Shared types and utilities
│
└── e2e-tests/         # Playwright E2E tests
```

## 🧪 Testing

Run E2E tests:
```bash
cd e2e-tests
npm install
npm test
```

## 🔒 Security Features

- JWT-based authentication
- HTTP-only cookies
- Password hashing with bcrypt
- CORS protection
- Secure payment processing

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
