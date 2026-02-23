# 💪 FitForge - Fitness Tracking Application

A comprehensive fitness tracking web application built with **Spring Boot** and modern web technologies. Track your workouts, monitor progress, and achieve your fitness goals!

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password encryption with BCrypt
- Role-based access control
- Session management

### 💪 Workout Management
- Create, read, update, and delete workouts
- Track workout type, duration, and calories burned
- Date-based workout filtering
- User-specific workout isolation

### 📊 Dashboard & Analytics
- Real-time workout statistics
- Total workouts, calories burned, and training time
- Weekly activity tracking
- Recent workout history

### 👤 User Profile
- Customizable user profiles
- Track personal metrics (age, weight, height)
- Set fitness goals
- Password management

### 🏋️ Exercise Library
- Comprehensive exercise database
- Search and filter exercises
- Detailed exercise information
- Muscle group targeting

### 🎨 Modern UI/UX
- Beautiful gradient design
- Smooth animations and transitions
- Fully responsive layout
- Glassmorphism effects
- Dark mode ready

## 🚀 Quick Start

### Prerequisites
- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+
- Modern web browser

### Database Setup

1. **Create MySQL Database:**
```sql
CREATE DATABASE fitforge;
CREATE USER 'fituser'@'localhost' IDENTIFIED BY 'FitForge@123';
GRANT ALL PRIVILEGES ON fitforge.* TO 'fituser'@'localhost';
FLUSH PRIVILEGES;
```

2. **Tables will be auto-created** by Hibernate on first run.

### Running the Application

1. **Clone the repository:**
```bash
git clone https://github.com/vaibhavwale/fitforge.git
cd fitforge
```

2. **Configure database** (if needed):
Edit `src/main/resources/application.properties`

3. **Build and run:**
```bash
./mvnw clean install
./mvnw spring-boot:run
```

Or on Windows:
```bash
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

4. **Access the application:**
Open your browser and navigate to: `http://localhost:8080`

## 📁 Project Structure

```
fitforge/
├── src/
│   ├── main/
│   │   ├── java/com/fitforge/tracker/
│   │   │   ├── config/          # Security, CORS, JWT configuration
│   │   │   ├── controller/      # REST API endpoints
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── exception/       # Custom exceptions & handlers
│   │   │   ├── repository/      # Data access layer
│   │   │   └── service/         # Business logic
│   │   └── resources/
│   │       ├── static/          # Frontend files
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   └── index.html
│   │       ├── data/            # Exercise data
│   │       └── application.properties
│   └── test/                    # Unit tests
├── pom.xml
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password

### Workouts
- `GET /api/workouts` - Get all user workouts
- `GET /api/workouts/{id}` - Get specific workout
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/{id}` - Update workout
- `DELETE /api/workouts/{id}` - Delete workout
- `GET /api/workouts/date-range?startDate=&endDate=` - Filter by date

### Exercises
- `GET /api/exercises` - Get all exercises
- `GET /api/exercises/{name}` - Get exercise by name

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.5** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **JWT (jjwt 0.11.5)** - Token-based authentication
- **MySQL** - Database
- **Lombok** - Boilerplate reduction
- **Maven** - Build tool

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern features
- **Vanilla JavaScript** - Client-side logic
- **Fetch API** - HTTP requests
- **LocalStorage** - Token persistence

## 🎨 Design Features

- **Modern Gradients** - Eye-catching color schemes
- **Smooth Animations** - Enhanced user experience
- **Glassmorphism** - Frosted glass effects
- **Responsive Design** - Mobile-first approach
- **Micro-interactions** - Hover effects and transitions
- **Custom Typography** - Inter font family

## 📝 Usage Guide

### First Time Setup

1. **Register an Account:**
   - Click "Create one" on the login page
   - Enter your email and password
   - Optionally add your full name

2. **Login:**
   - Use your credentials to sign in
   - JWT token is automatically stored

3. **Complete Your Profile:**
   - Navigate to Profile page
   - Add personal metrics
   - Set your fitness goal

4. **Start Tracking:**
   - Go to Workouts page
   - Click "Add Workout"
   - Fill in workout details
   - Track your progress on Dashboard

### Using Postman

A Postman collection is included for API testing:
1. Import `FitForge_Postman_Collection.json`
2. See `POSTMAN_GUIDE.md` for detailed instructions

## 🔒 Security Features

- **Password Encryption** - BCrypt hashing
- **JWT Authentication** - Stateless sessions
- **CORS Configuration** - Controlled access
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization
- **CSRF Protection** - Disabled for API (JWT-based)

## 🧪 Testing

Run tests with:
```bash
./mvnw test
```

## 📦 Building for Production

```bash
./mvnw clean package
java -jar target/Tracker-0.0.1-SNAPSHOT.jar
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by the FitForge Team

## 🙏 Acknowledgments

- Spring Boot community
- Exercise data from public fitness APIs
- Inter font by Rasmus Andersson

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review Postman collection

---

**Happy Tracking! 💪🏋️‍♂️**
