# 🎓 EduPlan - Student Task Management System

Welcome to **EduPlan**! A specialized Single Page Application (SPA) designed for students to organize their academic life through an intuitive, professional, and blue-themed dashboard.

---

## 📝 Project Overview
**EduPlan** transitioned from a commercial food system to a productivity tool. It focuses on task persistence, priority management, and academic statistics, using a modern **Sidebar-driven navigation** optimized for desktop and responsive views.

**Core Technologies:**
* **Vite.js:** High-performance frontend tooling.
* **Vanilla JavaScript (ES6+):** Clean, modular logic with state management via LocalStorage.
* **JSON-Server:** Mock REST API for student data and task persistence.
* **CSS3 (Flexbox/Grid):** Professional blue-themed UI with a fixed-sidebar layout.

---

## 👥 Roles & Permissions

The system manages access through a dedicated role-based system:

| Icon | Role | Key Responsibilities |
| :---: | :--- | :--- |
| 🎓 | **Student** | Create, edit, and delete personal tasks. Monitor academic stats. |
| 👨‍🏫 | **Tutor/Admin** | Oversee student progress, manage user roles, and system-wide task auditing. |

---

## 🔄 System Modules

1.  **Dashboard:** A birds-eye view of academic performance (Total, Pending, and Completed tasks).
2.  **My Tasks:** A full-width management area to CRUD (Create, Read, Update, Delete) assignments.
3.  **Profile:** Personal information management and account customization.
4.  **Auth System:** Secure Login and Register flows with a unified professional blue aesthetic.

---

## 🚀 Installation & Setup

Follow these steps to deploy the environment locally:

### 1. Clone & Install
```bash``
# Clone the repository
git clone [...]

# Navigate to the project folder
cd eduplan

# Install project dependencies
npm install

# Back-end Run
npx json-server --watch db.json --port 3001

# App Run
npm run dev