# MomentMingle

A modern social connection platform designed to foster meaningful interactions among friends, couples, and close companions. The application empowers users to plan shared activities, capture and preserve memories through photos, and maintain connections via an intuitive pairing system.

## ✨ Core Features

### 🔐 User Authentication
- Secure email/password registration and login
- Profile creation with customizable display names
- Robust session management

### 👥 Pairing System
- Generate unique 6-character pairing codes
- QR code generation for instant connections
- Support for one-to-one and one-to-many relationships

### 📅 Activity Planning
- Create personalized activities with categories
- Set priorities and due dates
- Track activity status (pending, in-progress, completed)

### 📸 Memory Capture
- Upload and store photos with captions
- Link memories to specific activities
- Timeline view for chronological memories

### 💬 Social Interactions
- React to memories with emojis
- Comment on shared memories
- Real-time updates for engagement

## Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- JSON Web Tokens (JWT) for authentication
- Zod for schema validation

### Frontend (Coming Soon)
- React.js with TypeScript
- Responsive design for all devices
- Real-time updates using WebSockets

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TypeScript

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Moments-Mingle.git
   cd Moments-Mingle
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory and add your environment variables:
   ```
   PORT=3001
   JWT_SECRET=your_jwt_secret
   # Add other environment variables as needed
   ```

### Running the Application

1. Start the development server:
   ```bash
   cd backend
   npm run dev
   ```
   The server will be running at `http://localhost:3001` by default.

2. (Frontend setup instructions will be added here)

## Available Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the TypeScript project
- `npm start` - Start the production server
- `npm test` - Run tests

## API Documentation

(API documentation will be added here)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
