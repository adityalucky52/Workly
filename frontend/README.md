# User Management System - Frontend

A modern React-based user management dashboard with role-based layouts (Admin, Manager, Employee) using React Router v6+ nested routes.

---

## 📁 Complete Folder Structure

```
src/
│
├── main.jsx                          # Entry point with BrowserRouter + ThemeProvider
├── App.jsx                           # Root component rendering AppRoutes
│
├── routes/
│   ├── AppRoutes.jsx                 # Main routing configuration
│   ├── AdminRoutes.jsx               # Admin nested routes
│   ├── ManagerRoutes.jsx             # Manager nested routes
│   ├── EmployeeRoutes.jsx            # Employee nested routes
│   └── ProtectedRoute.jsx            # Auth guard for protected routes
│
├── layouts/
│   │
│   ├── admin/
│   │   ├── AdminLayout.jsx           # Admin wrapper with Outlet
│   │   ├── AdminHeader.jsx           # Admin top navbar
│   │   ├── AdminSidebar.jsx          # Admin navigation sidebar
│   │   └── AdminBreadcrumb.jsx       # Breadcrumb navigation
│   │
│   ├── manager/
│   │   ├── ManagerLayout.jsx         # Manager wrapper with Outlet
│   │   ├── ManagerHeader.jsx         # Manager top navbar
│   │   ├── ManagerSidebar.jsx        # Manager navigation sidebar
│   │   └── ManagerBreadcrumb.jsx     # Breadcrumb navigation
│   │
│   └── employee/
│       ├── EmployeeLayout.jsx        # Employee wrapper with Outlet
│       ├── EmployeeHeader.jsx        # Employee top navbar
│       ├── EmployeeSidebar.jsx       # Employee navigation sidebar
│       └── EmployeeBreadcrumb.jsx    # Breadcrumb navigation
│
├── pages/
│   │
│   ├── auth/
│   │   ├── Login.jsx                 # Login form page
│   │   ├── ForgotPassword.jsx        # Forgot password page
│   │   └── ResetPassword.jsx         # Reset password page
│   │
│   ├── admin/
│   │   ├── Dashboard.jsx             # Admin dashboard overview
│   │   │
│   │   ├── users/
│   │   │   ├── AllUsers.jsx          # List all users
│   │   │   ├── CreateUser.jsx        # Create new user form
│   │   │   ├── UserDetails.jsx       # View/edit user details
│   │   │   └── AssignManager.jsx     # Assign manager to user
│   │   │
│   │   ├── managers/
│   │   │   ├── ManagerList.jsx       # List all managers
│   │   │   └── ManagerDetails.jsx    # View manager details + team
│   │   │
│   │   ├── employees/
│   │   │   ├── EmployeeList.jsx      # List all employees
│   │   │   ├── EmployeeDetails.jsx   # View employee details
│   │   │   └── TransferEmployee.jsx  # Transfer employee to team
│   │   │
│   │   ├── tasks/
│   │   │   ├── AllTasks.jsx          # View all tasks in system
│   │   │   └── TaskDetails.jsx       # Task details view
│   │   │
│   │   ├── reports/
│   │   │   ├── SystemOverview.jsx    # System-wide statistics
│   │   │   └── WorkloadReport.jsx    # Workload distribution report
│   │   │
│   │   └── settings/
│   │       └── AdminSettings.jsx     # Admin settings page
│   │
│   ├── manager/
│   │   ├── Dashboard.jsx             # Manager dashboard
│   │   │
│   │   ├── team/
│   │   │   ├── TeamOverview.jsx      # View team members
│   │   │   ├── EmployeeProfile.jsx   # View employee profile
│   │   │   └── WorkloadView.jsx      # Team workload overview
│   │   │
│   │   ├── tasks/
│   │   │   ├── CreateTask.jsx        # Create new task
│   │   │   ├── MyTasks.jsx           # Manager's own tasks
│   │   │   ├── AssignedTasks.jsx     # Tasks assigned to team
│   │   │   └── TaskDetails.jsx       # Task details view
│   │   │
│   │   ├── reports/
│   │   │   ├── TeamPerformance.jsx   # Team performance report
│   │   │   └── TaskCompletion.jsx    # Task completion stats
│   │   │
│   │   └── settings/
│   │       └── ManagerSettings.jsx   # Manager settings page
│   │
│   ├── employee/
│   │   ├── Dashboard.jsx             # Employee dashboard
│   │   │
│   │   ├── tasks/
│   │   │   ├── MyTasks.jsx           # My assigned tasks
│   │   │   ├── TaskDetails.jsx       # Task details view
│   │   │   └── UpdateStatus.jsx      # Update task status
│   │   │
│   │   ├── activity/
│   │   │   ├── TaskHistory.jsx       # Task history log
│   │   │   └── Comments.jsx          # Task comments
│   │   │
│   │   └── settings/
│   │       └── EmployeeSettings.jsx  # Employee settings page
│   │
│   └── common/
│       ├── NotFound.jsx              # 404 page
│       ├── Unauthorized.jsx          # 401/403 unauthorized page
│       └── Profile.jsx               # Shared profile page
│
├── components/
│   │
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── table.jsx
│   │   ├── input.jsx
│   │   ├── dialog.jsx
│   │   ├── sidebar.jsx
│   │   ├── dropdown-menu.jsx
│   │   ├── avatar.jsx
│   │   ├── badge.jsx
│   │   ├── tabs.jsx
│   │   ├── sheet.jsx
│   │   ├── skeleton.jsx
│   │   ├── tooltip.jsx
│   │   ├── chart.jsx
│   │   ├── separator.jsx
│   │   └── theme-provider.jsx
│   │
│   ├── shared/                       # Reusable shared components
│   │   ├── DataTable.jsx             # Generic data table
│   │   ├── SearchInput.jsx           # Search input component
│   │   ├── StatCard.jsx              # Dashboard stat card
│   │   ├── PageHeader.jsx            # Page title + actions
│   │   ├── ConfirmDialog.jsx         # Confirmation modal
│   │   ├── LoadingSpinner.jsx        # Loading indicator
│   │   ├── EmptyState.jsx            # Empty data state
│   │   └── ErrorBoundary.jsx         # Error boundary wrapper
│   │
│   ├── forms/                        # Form components
│   │   ├── UserForm.jsx              # Create/Edit user form
│   │   ├── TaskForm.jsx              # Create/Edit task form
│   │   ├── LoginForm.jsx             # Login form
│   │   └── PasswordResetForm.jsx     # Password reset form
│   │
│   └── charts/                       # Chart components
│       ├── TaskStatusChart.jsx       # Task status pie chart
│       ├── WorkloadBarChart.jsx      # Workload bar chart
│       └── ActivityLineChart.jsx     # Activity trend chart
│
├── services/                         # API service layer
│   ├── api.js                        # Axios instance + interceptors
│   ├── authService.js                # Login, logout, token refresh
│   ├── userService.js                # User CRUD operations
│   ├── taskService.js                # Task CRUD operations
│   ├── managerService.js             # Manager-specific APIs
│   └── reportService.js              # Reports/analytics APIs
│
├── hooks/                            # Custom React hooks
│   ├── useAuth.js                    # Auth state + methods
│   ├── useApi.js                     # API call wrapper hook
│   ├── useDebounce.js                # Debounce hook
│   ├── usePagination.js              # Pagination hook
│   └── use-mobile.js                 # Mobile detection (shadcn)
│
├── context/                          # React Context providers
│   ├── AuthContext.jsx               # Auth state context
│   ├── ThemeContext.jsx              # Theme context (light/dark)
│   └── SidebarContext.jsx            # Sidebar state context
│
├── store/                            # State management (optional)
│   ├── store.js                      # Redux/Zustand store setup
│   └── slices/
│       ├── authSlice.js              # Auth state slice
│       ├── userSlice.js              # Users state slice
│       └── taskSlice.js              # Tasks state slice
│
├── utils/                            # Utility functions
│   ├── constants.js                  # App constants
│   ├── formatters.js                 # Date, number formatters
│   ├── validators.js                 # Form validation helpers
│   └── helpers.js                    # General helper functions
│
├── lib/
│   └── utils.js                      # shadcn cn() utility
│
└── assets/
    ├── images/
    │   └── logo.svg
    └── icons/
        └── ...
```

---

## 🧭 Routing Architecture

### URL Structure

| Role     | Base Path   | Example Routes                            |
| -------- | ----------- | ----------------------------------------- |
| Auth     | `/auth`     | `/auth/login`, `/auth/forgot-password`    |
| Admin    | `/admin`    | `/admin/dashboard`, `/admin/users/create` |
| Manager  | `/manager`  | `/manager/dashboard`, `/manager/tasks`    |
| Employee | `/employee` | `/employee/dashboard`, `/employee/tasks`  |

### Nested Route Pattern

```
/admin/users/create
   ↓
AdminLayout (renders shared UI)
   ├── AdminHeader
   ├── AdminSidebar
   ├── AdminBreadcrumb
   └── <Outlet />  ← CreateUser.jsx renders here
```

---

## 🎨 Layout Components

### Each Layout Contains:

| Component         | Purpose                                    |
| ----------------- | ------------------------------------------ |
| `*Layout.jsx`     | Wrapper with `<Outlet />` for nested pages |
| `*Header.jsx`     | Top navbar with user menu, notifications   |
| `*Sidebar.jsx`    | Navigation links for that role             |
| `*Breadcrumb.jsx` | Dynamic breadcrumb based on route          |

---

## 📦 Required Dependencies

```bash
# Already Installed
npm install react-router-dom         # Routing
npm install tailwindcss              # Styling
npm install @tailwindcss/vite        # Vite plugin

# To Install
npm install axios                    # API calls
npm install react-hook-form          # Form handling
npm install zod                      # Schema validation
npm install @hookform/resolvers      # Zod + react-hook-form
npm install zustand                  # State management (optional)
npm install date-fns                 # Date formatting
npm install lucide-react             # Icons (shadcn uses this)
npm install recharts                 # Charts (shadcn charts)
```

---

## 🔐 Protected Routes Pattern

```jsx
// ProtectedRoute.jsx
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
};
```

---

## 🚀 Getting Started

1. Create the folder structure as shown above
2. Install required dependencies
3. Set up routing in `AppRoutes.jsx`
4. Build layouts with shared UI components
5. Create pages that render in `<Outlet />`
6. Connect to backend APIs via services

---

## 📝 Development Checklist

### Phase 1: Core Setup

- [ ] Set up folder structure
- [ ] Configure React Router
- [ ] Create all layout components
- [ ] Set up AuthContext

### Phase 2: Authentication

- [ ] Login page
- [ ] Forgot password page
- [ ] Reset password page
- [ ] Protected route guards

### Phase 3: Admin Dashboard

- [ ] Admin layout (header, sidebar, breadcrumb)
- [ ] Dashboard with stats
- [ ] User management (CRUD)
- [ ] Manager management
- [ ] Employee management

### Phase 4: Manager Dashboard

- [ ] Manager layout
- [ ] Team overview
- [ ] Task management
- [ ] Reports

### Phase 5: Employee Dashboard

- [ ] Employee layout
- [ ] My tasks view
- [ ] Task status updates
- [ ] Activity history

### Phase 6: Polish

- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Responsive design
- [ ] Dark mode toggle

---

## 🎯 Key Patterns to Follow

1. **Nested Routes** - Parent layouts wrap child pages via `<Outlet />`
2. **Role-Based Layouts** - Each role has its own layout with specific navigation
3. **Protected Routes** - Check auth + role before rendering
4. **Service Layer** - Keep API calls in `/services` folder
5. **Shared Components** - Reuse UI components across roles
6. **shadcn/ui** - Use pre-built components for consistency

---

_This structure follows React best practices and scales well for enterprise applications._
