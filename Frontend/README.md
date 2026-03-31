# TeamFlow — React Frontend

A full-featured React frontend for the Team Management Spring Boot backend.

## Features

- **Role-based dashboards** — Manager, Team Lead, Member
- **Kanban board** — drag-free visual task management
- **Charts & analytics** — recharts-powered performance insights
- **Task management** — create, edit, update status, comment, upload files
- **Team management** — create teams, manage members
- **User management** — create users, toggle active status
- **Real-time notifications** — unread badge, mark as read
- **JWT authentication** — secure login, auto-redirect by role
- **Beautiful UI** — Inter font, indigo/violet palette, animated modals

## Setup

### Prerequisites
- Node.js 16+ and npm
- Backend running at `http://localhost:8080`

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend CORS
Make sure your `application.properties` has:
```
app.cors.allowed-origins=http://localhost:3000
```

## Default Accounts (from DataInitializer)

| Role      | Username  | Password  |
|-----------|-----------|-----------|
| Manager   | admin     | admin123  |
| Team Lead | teamlead  | pass123   |
| Member    | member    | pass123   |

## Project Structure

```
src/
├── api/           # Axios instance
├── context/       # Auth context (JWT)
├── utils/         # Helpers (avatars, dates, labels)
├── components/
│   ├── layout/    # Sidebar, Layout wrapper
│   └── tasks/     # TaskModal (shared)
└── pages/
    ├── auth/      # Login, Register
    ├── manager/   # Dashboard, Teams, Users, Tasks, Analytics
    ├── teamlead/  # Dashboard, Tasks (Kanban+List), Team Members
    └── member/    # My Tasks, Notifications, Files
```

## API Base URL
Configured in `src/api/axios.js` → `http://localhost:8080/api`
