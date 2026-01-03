# 🚨 ProdWatch — Production Incident Management System

ProdWatch is a full-stack production incident management system designed to track, manage, and audit incidents in a structured and reliable way. It focuses on **data integrity, role-based access control, and auditability**, similar to internal tools used by engineering teams to handle production issues.

The project is built to reflect **real-world backend and system design practices**, rather than a simple CRUD application.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* JWT-based authentication with 1-hour expiry
* Role-Based Access Control (RBAC):

  * **Owner**
  * **Team Lead**
  * **Engineer**
* Permissions enforced consistently across backend APIs and frontend UI
* Global token-expiry handling on the frontend (automatic logout on 401)

---

### 🚑 Incident Management

* Create and manage incidents with a defined lifecycle:

  * **Open → Investigating → Mitigated → Resolved**
* Each incident maintains an **immutable timeline** of events
* Supports investigation notes and status change messages
* Clear attribution of actions to individual users

---

### 🕒 Event Timeline & Auditability

* Every critical incident action is recorded as an event:

  * Creation
  * Status changes
  * Notes
* Timeline is ordered, immutable, and traceable
* Designed for transparency and debugging accountability

---

### 🧾 Database-Level Audit Logs

* Audit logs are implemented using **PostgreSQL triggers**, not application logic
* Ensures critical changes are logged **even if application code changes**
* Owner-only access to audit logs
* Human-readable audit messages generated from raw audit data
* Demonstrates separation of concerns between business logic and data integrity

---

### 👥 Organization & Team Management

* Organization-based multi-user system
* Owner can:

  * Generate and rotate join codes
  * Promote or demote team members
* Users belong to exactly one organization
* Role changes are immediately enforced

---

## 🧱 Tech Stack

### Backend

* **Node.js**
* **Express**
* **PostgreSQL**
* **Raw SQL** (no ORM)
* **node-pg-migrate** for schema migrations
* JWT for authentication

### Frontend

* **React** (Vite)
* **Context API** for state management
* **Tailwind CSS**
* No React Router (simple view-based navigation)

### Deployment

* Backend: **Render**
* Frontend: **Vercel**
* PostgreSQL: Managed cloud database

---

## 🏗️ System Design Highlights

* **Raw SQL over ORM**
  Chosen to maintain control over queries, constraints, and performance.

* **Database Triggers for Auditing**
  Audit logs are generated at the database level to ensure integrity independent of application code.

* **Clear Separation of Concerns**

  * Auth & RBAC handled at middleware level
  * Business logic kept out of controllers where possible
  * Database responsible for enforcing critical invariants

* **Frontend Designed for Internal Tools**

  * Calm, predictable UI
  * Focus on clarity over visual effects
  * Optimized for stressed users during incidents

---

## 📂 High-Level Architecture

```
Frontend (React + Tailwind)
        ↓
REST APIs (Express)
        ↓
PostgreSQL
  ├── incidents
  ├── incident_events
  ├── audit_logs (via triggers)
  ├── users
  └── organizations
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

* Node.js (v18+ recommended)
* PostgreSQL
* npm

### Backend Setup

```bash
cd backend
npm install
npm run migrate up
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file for required environment variables (JWT secret, DB connection, etc.).

---

## 🔍 What This Project Demonstrates

* Real-world backend design decisions
* Secure authentication and authorization
* Relational database modeling
* Audit-safe system design
* Full-stack ownership from schema to UI
* Deployment and environment configuration

---

## 📌 Future Improvements

* Incident severity levels
* Pagination and filtering
* Notification hooks (Slack / Email)
* Dark mode
* Organization settings page

---

## 🧑‍💻 Author

**Akash Kalyan**
Full-Stack Developer (Backend-focused)
GitHub: [https://github.com/Akashkalyan19](https://github.com/Akashkalyan19)
LinkedIn: [https://linkedin.com/in/akash-kalyan](https://linkedin.com/in/akash-kalyan)

---

## 📝 License

This project is for learning and demonstration purposes.
