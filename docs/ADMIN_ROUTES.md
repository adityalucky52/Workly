# Admin Routes Documentation

> This document explains all the admin routes defined in the `AppRoutes.jsx` file for the Workly application.

---

## 📋 Overview

All admin routes are **protected** and require the user to be authenticated with the `admin` role. The routes are wrapped with the `ProtectedRoute` component and use the `AdminLayout` for consistent UI structure.

```jsx
<ProtectedRoute allowedRoles={["admin"]}>
  <AdminLayout />
</ProtectedRoute>
```

**Base Path:** `/admin`

---

## 🗂️ Route Structure

| #   | Route Path                        | Component              | Description                          |
| --- | --------------------------------- | ---------------------- | ------------------------------------ |
| 1   | `/admin`                          | `Navigate`             | Redirects to `/admin/dashboard`      |
| 2   | `/admin/dashboard`                | `AdminDashboard`       | Main admin dashboard                 |
| 3   | `/admin/users`                    | `AllUsers`             | List all users                       |
| 4   | `/admin/users/create`             | `CreateUser`           | Create a new user                    |
| 5   | `/admin/users/:id`                | `UserDetails`          | View user details                    |
| 6   | `/admin/users/:id/assign-manager` | `AssignManager`        | Assign manager to user               |
| 7   | `/admin/managers`                 | `ManagerList`          | List all managers                    |
| 8   | `/admin/managers/:id`             | `ManagerDetails`       | View manager details                 |
| 9   | `/admin/employees`                | `AdminEmployeeList`    | List all employees                   |
| 10  | `/admin/employees/:id`            | `AdminEmployeeDetails` | View employee details                |
| 11  | `/admin/employees/:id/transfer`   | `TransferEmployee`     | Transfer employee to another manager |
| 12  | `/admin/tasks`                    | `AllTasks`             | List all tasks                       |
| 13  | `/admin/tasks/:id`                | `AdminTaskDetails`     | View task details                    |
| 14  | `/admin/reports/overview`         | `SystemOverview`       | System overview report               |
| 15  | `/admin/reports/workload`         | `WorkloadReport`       | Workload report                      |
| 16  | `/admin/settings`                 | `AdminSettings`        | Admin settings page                  |

---

## 📁 Route Categories

### 1. 🏠 Dashboard

| Route              | Component        | Purpose                                                                                         |
| ------------------ | ---------------- | ----------------------------------------------------------------------------------------------- |
| `/admin/dashboard` | `AdminDashboard` | Displays key metrics including total employees, managers, tasks statistics, and recent activity |

---

### 2. 👥 User Management

Routes for managing all users in the system.

| Route                             | Component       | Purpose                                                                         |
| --------------------------------- | --------------- | ------------------------------------------------------------------------------- |
| `/admin/users`                    | `AllUsers`      | View a paginated list of all users with search and filter options               |
| `/admin/users/create`             | `CreateUser`    | Form to create a new user (employee or manager)                                 |
| `/admin/users/:id`                | `UserDetails`   | View detailed information about a specific user including their task statistics |
| `/admin/users/:id/assign-manager` | `AssignManager` | Assign a manager to a specific employee                                         |

**Dynamic Parameters:**

- `:id` - The unique identifier of the user

---

### 3. 👔 Manager Management

Routes for viewing and managing managers.

| Route                 | Component        | Purpose                                                                  |
| --------------------- | ---------------- | ------------------------------------------------------------------------ |
| `/admin/managers`     | `ManagerList`    | View all managers with their team information                            |
| `/admin/managers/:id` | `ManagerDetails` | View detailed manager profile including team members and task statistics |

**Dynamic Parameters:**

- `:id` - The unique identifier of the manager

---

### 4. 👤 Employee Management

Routes for managing employees across the organization.

| Route                           | Component              | Purpose                                          |
| ------------------------------- | ---------------------- | ------------------------------------------------ |
| `/admin/employees`              | `AdminEmployeeList`    | View all employees with filter by manager option |
| `/admin/employees/:id`          | `AdminEmployeeDetails` | View detailed employee profile with recent tasks |
| `/admin/employees/:id/transfer` | `TransferEmployee`     | Transfer an employee from one manager to another |

**Dynamic Parameters:**

- `:id` - The unique identifier of the employee

---

### 5. ✅ Task Management

Routes for overseeing all tasks in the system.

| Route              | Component          | Purpose                                                       |
| ------------------ | ------------------ | ------------------------------------------------------------- |
| `/admin/tasks`     | `AllTasks`         | View all tasks with filters for status, priority, and search  |
| `/admin/tasks/:id` | `AdminTaskDetails` | View detailed task information including assignee and creator |

**Dynamic Parameters:**

- `:id` - The unique identifier of the task

---

### 6. 📊 Reports

Routes for viewing system-wide reports and analytics.

| Route                     | Component        | Purpose                                                                                 |
| ------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| `/admin/reports/overview` | `SystemOverview` | View task completion rates, status distribution, priority breakdown, and monthly trends |
| `/admin/reports/workload` | `WorkloadReport` | View workload distribution by manager and top employees by task count                   |

---

### 7. ⚙️ Settings

| Route             | Component       | Purpose                                |
| ----------------- | --------------- | -------------------------------------- |
| `/admin/settings` | `AdminSettings` | Admin account settings and preferences |

---

## 🔐 Access Control

All admin routes are protected by the `ProtectedRoute` component which:

1. **Checks Authentication:** Ensures the user is logged in
2. **Validates Role:** Only users with `admin` role can access these routes
3. **Redirects:** Unauthorized users are redirected to the login page

```jsx
<ProtectedRoute allowedRoles={["admin"]}>{/* Admin routes */}</ProtectedRoute>
```

---

## 📂 Component File Locations

| Component              | File Path                                        |
| ---------------------- | ------------------------------------------------ |
| `AdminLayout`          | `src/layouts/admin/AdminLayout.jsx`              |
| `AdminDashboard`       | `src/pages/admin/Dashboard.jsx`                  |
| `AllUsers`             | `src/pages/admin/users/AllUsers.jsx`             |
| `CreateUser`           | `src/pages/admin/users/CreateUser.jsx`           |
| `UserDetails`          | `src/pages/admin/users/UserDetails.jsx`          |
| `AssignManager`        | `src/pages/admin/users/AssignManager.jsx`        |
| `ManagerList`          | `src/pages/admin/managers/ManagerList.jsx`       |
| `ManagerDetails`       | `src/pages/admin/managers/ManagerDetails.jsx`    |
| `AdminEmployeeList`    | `src/pages/admin/employees/EmployeeList.jsx`     |
| `AdminEmployeeDetails` | `src/pages/admin/employees/EmployeeDetails.jsx`  |
| `TransferEmployee`     | `src/pages/admin/employees/TransferEmployee.jsx` |
| `AllTasks`             | `src/pages/admin/tasks/AllTasks.jsx`             |
| `AdminTaskDetails`     | `src/pages/admin/tasks/TaskDetails.jsx`          |
| `SystemOverview`       | `src/pages/admin/reports/SystemOverview.jsx`     |
| `WorkloadReport`       | `src/pages/admin/reports/WorkloadReport.jsx`     |
| `AdminSettings`        | `src/pages/admin/settings/AdminSettings.jsx`     |

---

## 🔗 Navigation Flow

```
/admin (redirects to dashboard)
├── /dashboard
├── /users
│   ├── /create
│   ├── /:id
│   └── /:id/assign-manager
├── /managers
│   └── /:id
├── /employees
│   ├── /:id
│   └── /:id/transfer
├── /tasks
│   └── /:id
├── /reports
│   ├── /overview
│   └── /workload
└── /settings
```

---

## 📝 Notes

1. **Index Route:** Accessing `/admin` automatically redirects to `/admin/dashboard`
2. **Dynamic Routes:** Routes with `:id` parameter accept user/manager/employee/task IDs
3. **Nested Layout:** All admin pages are rendered within the `AdminLayout` component
4. **Protected Access:** All routes require admin authentication

---

_Last Updated: January 2026_
