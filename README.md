# EventHive 🎉

EventHive is a modern event management platform built with Next.js and FastAPI, designed to streamline the process of creating, managing, and booking events.

## Demo

[![Watch the video](vid/ss.png)](vid/EventHive.mp4)



## Features

- 🔐 Secure authentication system
- 👥 User role management (organizers and attendees)
- 📅 Event creation and management
- 🎫 Ticket booking system
- 🎨 Modern and responsive UI with Shadcn components
- 🌙 Dark/Light mode support
- 📱 Mobile-friendly design
- 🔒 Secure password handling
- 🎟️ QR code generation for tickets

## Tech Stack

### Frontend
- Next.js 13+
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Zustand (State Management)

### Backend
- FastAPI
- SQLite Database
- Python 3.10+
- JWT Authentication
- QR Code Generation

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.10+
- PNPM (for frontend package management)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Aviralansh/EventHive.git
cd EventHive
```

2. Backend Setup
```bash
cd eventhive-backend
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Configure your environment variables
python seed.py  # Initialize the database
python main.py  # Start the backend server
```

3. Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Project Structure

```
eventhive/
├── frontend/           # Next.js frontend application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/          # Utilities and API functions
│   └── public/       # Static assets
│
└── eventhive-backend/ # FastAPI backend
    ├── app/          # Application package
    │   ├── api/      # API routes
    │   ├── core/     # Core functionality
    │   ├── models/   # Database models
    │   ├── schemas/  # Pydantic schemas
    │   └── services/ # Business logic
    └── main.py      # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.