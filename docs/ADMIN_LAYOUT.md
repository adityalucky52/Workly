# 🎨 Admin Layout Documentation

> Detailed explanation of the `AdminLayout.jsx` component and its sub-components.

---

## 📐 Layout Structure Overview

The `AdminLayout` is the main wrapper component for all admin pages. It provides a consistent UI structure with a sidebar, header, breadcrumb navigation, and a main content area.

### Visual Layout Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SidebarProvider                                │
├──────────────────┬──────────────────────────────────────────────────────┤
│                  │                  SidebarInset                         │
│                  ├──────────────────────────────────────────────────────┤
│                  │                 AdminHeader                           │
│   AdminSidebar   │  ┌────────────────────────────────────────────────┐  │
│                  │  │              Search  |  Theme  |  Notifications  │  │
│   ┌───────────┐  │  │                                     |  Profile   │  │
│   │   Logo    │  │  └────────────────────────────────────────────────┘  │
│   ├───────────┤  ├──────────────────────────────────────────────────────┤
│   │   Main    │  │                                                      │
│   │ Dashboard │  │                  AdminBreadcrumb                     │
│   ├───────────┤  │  🏠 > Users > Details                                │
│   │   User    │  ├──────────────────────────────────────────────────────┤
│   │Management │  │                                                      │
│   ├───────────┤  │                                                      │
│   │   Tasks   │  │                     <Outlet />                       │
│   ├───────────┤  │                                                      │
│   │  Reports  │  │              (Page Content Renders Here)             │
│   ├───────────┤  │                                                      │
│   │  Settings │  │                                                      │
│   ├───────────┤  │                                                      │
│   │  Profile  │  │                                                      │
│   │ (Footer)  │  │                                                      │
│   └───────────┘  │                                                      │
└──────────────────┴──────────────────────────────────────────────────────┘
```

---

## 📦 AdminLayout Component

**File:** `src/layouts/admin/AdminLayout.jsx`

```jsx
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminBreadcrumb from "./AdminBreadcrumb";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AdminBreadcrumb />
          <main className="min-h-[calc(100vh-12rem)]">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
```

### Component Breakdown

| Component         | Purpose                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `SidebarProvider` | Context provider that manages sidebar state (open/closed, mobile, etc.) |
| `AdminSidebar`    | Left navigation sidebar with menu items                                 |
| `SidebarInset`    | Main content area that adjusts based on sidebar state                   |
| `AdminHeader`     | Top header with search, theme toggle, notifications, and user menu      |
| `AdminBreadcrumb` | Dynamic breadcrumb navigation based on current route                    |
| `<Outlet />`      | React Router's outlet where child route components render               |

---

## 🗂️ AdminSidebar Component

**File:** `src/layouts/admin/AdminSidebar.jsx`

The sidebar provides navigation to all admin sections.

### Sidebar Structure

```
┌────────────────────────┐
│  🛡️ Admin Panel        │  ← Header (Logo + Title)
│    User Management     │
├────────────────────────┤
│  📊 Main               │  ← SidebarGroup
│    └── Dashboard       │
├────────────────────────┤
│  👥 User Management    │  ← SidebarGroup
│    ├── All Users       │
│    ├── Managers        │
│    └── Employees       │
├────────────────────────┤
│  ✅ Tasks              │  ← SidebarGroup
│    └── All Tasks       │
├────────────────────────┤
│  📈 Reports            │  ← SidebarGroup
│    ├── System Overview │
│    └── Workload Report │
├────────────────────────┤
│  ⚙️ System             │  ← SidebarGroup
│    └── Settings        │
├────────────────────────┤
│  👤 Admin User         │  ← Footer (User Profile)
│    admin@example.com   │
│    [Dropdown Menu]     │
└────────────────────────┘
```

### Menu Items Configuration

```jsx
// Main Navigation
const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
];

// User Management Section
const managementItems = [
  { title: "All Users", icon: Users, path: "/admin/users" },
  { title: "Managers", icon: UserCog, path: "/admin/managers" },
  { title: "Employees", icon: UserCheck, path: "/admin/employees" },
];

// Tasks Section
const taskItems = [
  { title: "All Tasks", icon: ListTodo, path: "/admin/tasks" },
];

// Reports Section
const reportItems = [
  {
    title: "System Overview",
    icon: BarChart3,
    path: "/admin/reports/overview",
  },
  { title: "Workload Report", icon: FileText, path: "/admin/reports/workload" },
];

// Settings Section
const settingsItems = [
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];
```

### Icons Used (Lucide React)

| Icon              | Usage               |
| ----------------- | ------------------- |
| `Shield`          | Admin Panel logo    |
| `LayoutDashboard` | Dashboard           |
| `Users`           | All Users           |
| `UserCog`         | Managers            |
| `UserCheck`       | Employees           |
| `ListTodo`        | All Tasks           |
| `BarChart3`       | System Overview     |
| `FileText`        | Workload Report     |
| `Settings`        | Settings            |
| `ChevronUp`       | User dropdown arrow |
| `LogOut`          | Logout option       |

### Footer User Dropdown

The sidebar footer contains a user profile section with a dropdown menu:

| Option               | Description                  |
| -------------------- | ---------------------------- |
| **Account Settings** | Navigate to account settings |
| **Log out**          | Log out of the admin panel   |

---

## 🎯 AdminHeader Component

**File:** `src/layouts/admin/AdminHeader.jsx`

The header provides quick access to common actions and user information.

### Header Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ☰  │  🔍 Search users, tasks...           │  🌙  │  🔔 3  │  👤       │
└─────────────────────────────────────────────────────────────────────────┘
  │              │                               │       │       │
  │              │                               │       │       └── User Menu
  │              │                               │       └── Notifications
  │              │                               └── Theme Toggle
  │              └── Search Input
  └── Sidebar Toggle
```

### Features

| Feature            | Description                                            |
| ------------------ | ------------------------------------------------------ |
| **Sidebar Toggle** | Button to collapse/expand the sidebar                  |
| **Search Bar**     | Global search for users, tasks, etc.                   |
| **Theme Toggle**   | Switch between light and dark mode                     |
| **Notifications**  | Dropdown with recent notifications (shows badge count) |
| **User Menu**      | Dropdown with profile options and logout               |

### Theme Toggle Implementation

```jsx
const { theme, setTheme } = useTheme();

const toggleTheme = () => {
  setTheme(theme === "dark" ? "light" : "dark");
};
```

### Notification Dropdown Sample

```
┌──────────────────────────────┐
│       Notifications          │
├──────────────────────────────┤
│ 🆕 New user registered       │
│    John Doe just signed up   │
│    2 minutes ago             │
├──────────────────────────────┤
│ ✅ Task completed            │
│    Project documentation...  │
│    1 hour ago                │
├──────────────────────────────┤
│ 🔧 System update             │
│    New features available    │
│    3 hours ago               │
├──────────────────────────────┤
│    View all notifications    │
└──────────────────────────────┘
```

### User Menu Options

| Option   | Icon       | Action                 |
| -------- | ---------- | ---------------------- |
| Profile  | `User`     | View/edit profile      |
| Settings | `Settings` | Navigate to settings   |
| Log out  | `LogOut`   | Logout (styled in red) |

---

## 🍞 AdminBreadcrumb Component

**File:** `src/layouts/admin/AdminBreadcrumb.jsx`

Dynamic breadcrumb navigation that updates based on the current route.

### Route Labels Mapping

```jsx
const routeLabels = {
  admin: "Admin",
  dashboard: "Dashboard",
  users: "Users",
  create: "Create",
  managers: "Managers",
  employees: "Employees",
  tasks: "Tasks",
  reports: "Reports",
  overview: "System Overview",
  workload: "Workload Report",
  settings: "Settings",
  transfer: "Transfer",
  "assign-manager": "Assign Manager",
};
```

### Breadcrumb Examples

| Current Route                     | Breadcrumb Display                      |
| --------------------------------- | --------------------------------------- |
| `/admin/dashboard`                | _(Hidden - no breadcrumb on dashboard)_ |
| `/admin/users`                    | 🏠 > Users                              |
| `/admin/users/create`             | 🏠 > Users > Create                     |
| `/admin/users/123`                | 🏠 > Users > Details                    |
| `/admin/users/123/assign-manager` | 🏠 > Users > Details > Assign Manager   |
| `/admin/managers`                 | 🏠 > Managers                           |
| `/admin/reports/overview`         | 🏠 > Reports > System Overview          |
| `/admin/employees/456/transfer`   | 🏠 > Employees > Details > Transfer     |

### Smart Features

1. **Automatic Label Detection**: Converts route segments to readable labels
2. **ID Detection**: Recognizes UUIDs and numeric IDs, displaying them as "Details"
3. **Dashboard Exclusion**: Hides breadcrumb on the dashboard page
4. **Clickable Links**: All items except the last one are clickable for navigation

---

## 🎨 Styling Classes

### Layout Container

```jsx
<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
```

| Class         | Effect                          |
| ------------- | ------------------------------- |
| `flex flex-1` | Takes remaining space           |
| `flex-col`    | Vertical layout                 |
| `gap-4`       | 16px gap between children       |
| `p-4 pt-0`    | Padding on all sides except top |

### Main Content Area

```jsx
<main className="min-h-[calc(100vh-12rem)]">
```

- Ensures minimum height for content area
- Calculated based on viewport height minus header/breadcrumb space

### Header

```jsx
<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear ...">
```

| Class                       | Effect                                   |
| --------------------------- | ---------------------------------------- |
| `h-16`                      | 64px height                              |
| `shrink-0`                  | Prevents shrinking                       |
| `border-b`                  | Bottom border                            |
| `transition-[width,height]` | Smooth transition when sidebar collapses |

---

## 🔗 Component Dependencies

```
AdminLayout
├── react-router-dom (Outlet)
├── components/ui/sidebar (SidebarProvider, SidebarInset)
├── AdminSidebar
│   ├── components/ui/sidebar (multiple components)
│   ├── components/ui/avatar
│   ├── components/ui/dropdown-menu
│   └── lucide-react (icons)
├── AdminHeader
│   ├── components/ui/sidebar (SidebarTrigger)
│   ├── components/ui/separator
│   ├── components/ui/button
│   ├── components/ui/input
│   ├── components/ui/avatar
│   ├── components/ui/dropdown-menu
│   ├── components/ui/badge
│   ├── components/ui/theme-provider
│   └── lucide-react (icons)
└── AdminBreadcrumb
    ├── react-router-dom (useLocation, Link)
    ├── components/ui/breadcrumb
    └── lucide-react (Home icon)
```

---

## 📱 Responsive Behavior

The layout is designed to be responsive:

| Screen Size | Sidebar Behavior                       | Header Behavior                   |
| ----------- | -------------------------------------- | --------------------------------- |
| Desktop     | Visible, fixed on left                 | Full width with all elements      |
| Tablet      | Collapsible via trigger                | Compressed search bar             |
| Mobile      | Hidden by default, overlay when opened | Simplified with essential actions |

The `SidebarTrigger` component in the header allows toggling the sidebar on smaller screens.

---

## 📂 File Locations Summary

| Component       | Path                                    |
| --------------- | --------------------------------------- |
| AdminLayout     | `src/layouts/admin/AdminLayout.jsx`     |
| AdminSidebar    | `src/layouts/admin/AdminSidebar.jsx`    |
| AdminHeader     | `src/layouts/admin/AdminHeader.jsx`     |
| AdminBreadcrumb | `src/layouts/admin/AdminBreadcrumb.jsx` |

---

## 🔄 How It Works Together

1. **User navigates** to any `/admin/*` route
2. **ProtectedRoute** verifies admin role
3. **AdminLayout** renders with:
   - `SidebarProvider` managing sidebar state
   - `AdminSidebar` displaying navigation
   - `AdminHeader` showing top bar
   - `AdminBreadcrumb` showing current location
   - `<Outlet />` rendering the specific page component

---

_Last Updated: January 2026_
