# The Chauffeur Co. / Future Ride Explorer

A premium car rental and showcase application designed to provide a luxurious and futuristic user experience.

## Project Overview

**The Chauffeur Co.** allows users to explore a fleet of high-end vehicles, view detailed specifications, and book rides for their journeys. The application features a sleek, dark-themed UI with smooth animations and a focus on premium aesthetics.

## Features

### 🚗 Fleet Exploration
- **Browse Vehicles**: View a curated list of luxurious cars.
- **Detailed Views**: Check car specifications, features, and pricing.
- **Filtering**: Filter cars by category (SUV, Sedan, Luxury, etc.).

### 📅 Booking System
- **Easy Booking**: Select dates and book your preferred vehicle.
- **Real-time Availability**: Check if a car is available for your desired dates.

### 👤 User Experience
- **Authentication**: Secure Login and Signup functionality.
- **User Profile**: Manage personal details and view booking history.
- **My Bookings**: Track current and past bookings.

### 🛡️ Admin Dashboard
- **Protected Route**: Secure access for administrators.
- **Manage Bookings**: View and manage all user bookings.
- **Fleet Management**: Add, edit, or remove vehicles from the fleet.

### 💻 Technical Highlights
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **Modern UI**: Built with **Shadcn UI** and **Tailwind CSS** for a polished look.
- **Animations**: Smooth transitions using **GSAP** and custom CSS animations.
- **Backend**: Powered by **Firebase** for authentication and data storage.
- **Email Notifications**: Integrated with **SendGrid** for booking confirmations.

## Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Backend / BaaS**: Firebase (Firestore, Auth)
- **Utilities**: Lucide React (Icons), date-fns, Zod (Validation)

## Getting Started

### Prerequisites
- Node.js & npm installed

### Installation

1.  **Clone the repository**
    ```sh
    git clone <YOUR_GIT_URL>
    cd future-ride-explorer-29
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Start the development server**
    ```sh
    npm run dev
    ```

4.  **Build for production**
    ```sh
    npm run build
    ```

## Project Structure

- `src/components`: Reusable UI components.
- `src/pages`: Application pages (Home, Booking, Profile, Admin, etc.).
- `src/services`: API calls and Firebase interactions.
- `src/contexts`: React contexts (Auth, etc.).
- `src/utils`: Helper functions and configurations.

## License

This project is for educational and demonstration purposes.
