# Hotel Management System - Frontend

A modern, responsive React frontend for the hotel booking and property management system.

## Features

- **User Authentication**: Login, registration, and profile management
- **Property Browsing**: Search, filter, and view property details
- **Booking System**: Create, view, and manage bookings
- **Favorites**: Save and manage favorite properties
- **Reviews**: Read and write property reviews
- **Admin Dashboard**: Property and booking management for administrators
- **Responsive Design**: Mobile-friendly interface
- **Real-time Notifications**: Toast notifications for user actions

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Styling**: CSS3 with modern features

## Prerequisites

- Node.js (v14 or higher)
- Bun package manager
- Backend server running on port 5000

## Installation

1. Install dependencies:
```bash
bun install
```

2. Start the development server:
```bash
bun run dev
```

3. Build for production:
```bash
bun run build
```

4. Preview production build:
```bash
bun run preview
```

## Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── Navbar.jsx       # Navigation component
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # User login
│   │   ├── Register.jsx     # User registration
│   │   ├── Properties.jsx   # Property listings
│   │   ├── PropertyDetail.jsx # Property details
│   │   ├── Dashboard.jsx    # User dashboard
│   │   ├── Bookings.jsx     # User bookings
│   │   ├── Favorites.jsx    # User favorites
│   │   ├── Profile.jsx      # User profile
│   │   ├── AdminDashboard.jsx # Admin dashboard
│   │   ├── AdminProperties.jsx # Admin property management
│   │   ├── AdminBookings.jsx # Admin booking management
│   │   ├── AddProperty.jsx  # Add new property
│   │   └── EditProperty.jsx # Edit property
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global styles
│   ├── index.css            # Base styles
│   └── main.jsx             # App entry point
├── index.html
├── package.json
└── vite.config.js
```

## Key Features

### Authentication
- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes
- Persistent login state

### Property Management
- Browse properties with search and filters
- Detailed property views with image galleries
- Admin property CRUD operations
- Property availability management

### Booking System
- Interactive booking creation
- Booking status tracking
- Admin booking management
- Booking history and details

### User Experience
- Responsive design for all devices
- Loading states and error handling
- Toast notifications for feedback
- Intuitive navigation and UI

## API Integration

The frontend communicates with the backend API running on `http://localhost:5000`. All API calls are handled through Axios with proper error handling and authentication headers.

### API Endpoints Used

- Authentication: `/auth/*`
- Properties: `/properties/*`
- Bookings: `/bookings/*`
- Favorites: `/favorites/*`
- Reviews: `/reviews/*`

## Styling

The application uses modern CSS with:
- CSS Grid and Flexbox for layouts
- CSS Variables for theming
- Responsive design principles
- Smooth animations and transitions
- Mobile-first approach

## Demo Accounts

The login page includes demo account buttons for easy testing:
- **Admin Demo**: Full administrative access
- **User Demo**: Standard user access

## Development

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint

### Code Style

- Modern React with hooks
- Functional components
- Context API for state management
- Clean, readable code structure
- Consistent naming conventions

## Deployment

1. Build the application:
```bash
bun run build
```

2. Deploy the `dist` folder to your hosting service

3. Ensure the backend API is accessible from your deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.
