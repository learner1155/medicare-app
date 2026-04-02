# MediCare - Healthcare Management System

A full-stack healthcare management application built with **React** (frontend) and **ASP.NET Core 8** (backend).

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap)

## ?? Features

- **Secure Authentication** - JWT-based authentication with encrypted credentials (RSA-OAEP + AES)
- **Dashboard** - Overview of appointments, activities, and health stats
- **Appointments** - Book, reschedule, and manage medical appointments
- **Services** - Browse available medical services
- **Contact** - Contact form with validation
- **Responsive Design** - Mobile-friendly UI with Bootstrap 5
- **Rate Limiting** - Protection against brute-force attacks
- **Secure Password Hashing** - PBKDF2 with 100,000 iterations

## ??? Tech Stack

### Frontend
- React 19
- React Router DOM
- Bootstrap 5.3
- Font Awesome 6
- Vite (Build tool)

### Backend
- ASP.NET Core 8
- JWT Authentication
- Web Crypto API (RSA-OAEP, AES-CBC)
- PBKDF2 Password Hashing

## ?? Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

## ?? Getting Started


### Backend Setup

```bash
cd ReactApp1.Server
dotnet restore
dotnet run
```

### Frontend Setup

```bash
cd reactapp1.client
npm install
npm run dev
```

### Run Both (Visual Studio)

1. Open `ReactApp1.sln` in Visual Studio 2022
2. Press `F5` or click "Start Debugging"
3. The app will open at `https://localhost:7xxx`

## ?? Demo Credentials

| Username | Password |
|----------|----------|
| `user` | `Password123!` |

## ?? Project Structure

```
ReactApp1/
??? ReactApp1.Server/          # ASP.NET Core Backend
?   ??? Controllers/
?   ?   ??? LoginController.cs    # Authentication
?   ?   ??? ContactController.cs  # Contact form
?   ?   ??? ProtectedController.cs
?   ??? Program.cs
?
??? reactapp1.client/          # React Frontend
?   ??? src/
?   ?   ??? context/
?   ?   ?   ??? AuthContext.jsx
?   ?   ??? pages/
?   ?   ?   ??? Home.jsx
?   ?   ?   ??? About.jsx
?   ?   ?   ??? Services.jsx
?   ?   ?   ??? Appointments.jsx
?   ?   ?   ??? Contact.jsx
?   ?   ??? App.jsx
?   ?   ??? Login.jsx
?   ?   ??? Dashboard.jsx
?   ??? index.html
?
??? README.md
```

## ?? Security Features

1. **Hybrid Encryption**: RSA-OAEP for key exchange + AES-CBC for credential encryption
2. **JWT Tokens**: Stateless authentication with 1-hour expiration
3. **PBKDF2 Hashing**: 100,000 iterations with SHA-256
4. **Rate Limiting**: 5 failed attempts = 15-minute lockout
5. **HTTPS**: Secure communication

## ?? Screenshots

### Login Page
Modern split-screen login with secure encrypted authentication.

### Dashboard
Clean dashboard with stats, appointments, and activity feed.

### Services
Browse available medical services with detailed information.

## ?? Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ?? License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ????? Author

Your Name - Prakash Bodhane

---

? Star this repo if you find it helpful!
