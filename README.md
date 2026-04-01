# Role-Based Authentication System

A comprehensive Node.js backend application featuring role-based access control (RBAC), JWT authentication, and music/album management with image storage. Built with Express.js and MongoDB.

## 📋 Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Role-Based Access Control**: Differentiate permissions based on user roles
- **Music Management**: CRUD operations for music tracks
- **Album Management**: Create and manage music albums
- **Image Storage**: Integrated ImageKit for media file uploads
- **Password Security**: Bcrypt encryption for password hashing
- **Cookie-based Sessions**: Secure token management with cookies
- **Comprehensive Testing**: Jest and Supertest for unit and integration tests

## 🗂️ Project Structure

```
Role-Base-Auth/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   └── db.js             # MongoDB connection setup
│   ├── controllers/           # Business logic handlers
│   │   ├── auth.controller.js
│   │   ├── music.controller.js
│   │   └── album.controllers.js
│   ├── middleware/
│   │   └── auth.middleware.js # JWT & role verification
│   ├── models/                # MongoDB schemas
│   │   ├── user.model.js
│   │   ├── music.model.js
│   │   └── album.model.js
│   ├── routes/                # API endpoints
│   │   ├── auth.route.js
│   │   ├── music.routes.js
│   │   └── album.routes.js
│   ├── services/
│   │   └── storage.service.js # ImageKit integration
│   └── test/
│       └── _app.test.js       # Test suite
├── server.js                  # Server entry point
├── package.json
└── jest.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- ImageKit account (optional, for image storage)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd Role-Base-Auth
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory

```env
PORT=3001
DB_URL=mongodb://your_database_url
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
JWT_SECRET=your_jwt_secret_key
```

4. Start the server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3001`

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Create a new user account
- `POST /login` - Login and receive JWT token
- `POST /logout` - Logout and clear session

### Music Routes (`/api/music`)

- `GET /` - Get all music tracks
- `POST /` - Create new music track (authenticated)

### Album Routes (`/api/album`)

- `GET /` - Get all albums
- `GET /:id` - Get specific album
- `POST /` - Create new album (authenticated)

## 🔐 Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication:

1. Users receive a JWT token upon successful login
2. Token is stored in cookies
3. Protected routes verify the token via `auth.middleware.js`
4. User roles determine access permissions for different endpoints

## 🧪 Testing

Run the test suite using Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

Tests are located in `src/test/` and use Supertest for HTTP assertion testing.

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie middleware
- **multer** - File upload handling
- **@imagekit/nodejs** - Image storage and optimization
- **dotenv** - Environment variable management
- **jest** - Testing framework
- **supertest** - HTTP assertion library
- **nodemon** - Development server with auto-reload

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run full test suite
npm run test:watch   # Run tests in watch mode
```

## 📝 Environment Variables

| Variable                | Description                 |
| ----------------------- | --------------------------- |
| `PORT`                  | Server port (default: 3001) |
| `DB_URL`                | MongoDB connection string   |
| `JWT_SECRET`            | Secret key for JWT signing  |
| `IMAGEKIT_PRIVATE_KEY`  | ImageKit private key        |

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request
