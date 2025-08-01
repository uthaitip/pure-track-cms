# CMS System - Role-Based Authentication with Nuxt 3 SSR

A complete Content Management System built with Nuxt 3, featuring server-side rendering, JWT authentication, role-based access control, and dynamic menu system connected to MongoDB.

## 🚀 Features

- **🔐 Authentication System**: JWT-based login/logout with bcrypt password hashing
- **🧑‍💼 Role-Based Access Control**: 4 roles (admin, employee, accountant, hr) with granular permissions
- **📂 Dynamic Menu System**: Role-based navigation with hierarchical menu support
- **⚡ Server-Side Rendering**: Optimized for SEO and performance
- **🎨 Modern UI**: Built with Tailwind CSS and responsive design
- **🔒 Security**: Input validation, SQL injection prevention, and secure JWT handling

## 🛠️ Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript, Tailwind CSS
- **Backend**: Nuxt 3 Server API, Mongoose
- **Database**: MongoDB Atlas
- **Authentication**: JWT, bcrypt
- **Icons**: Font Awesome 6

## 📁 Project Structure

```
├── server/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── user/              # User management
│   │   ├── menus/             # Menu system
│   │   └── seed.post.ts       # Database seeding
│   ├── models/                # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Role.ts
│   │   ├── Permission.ts
│   │   └── Menu.ts
│   └── utils/                 # Utility functions
│       ├── db.ts              # Database connection
│       ├── jwt.ts             # JWT utilities
│       └── auth.ts            # Authentication middleware
├── pages/                     # Application pages
├── layouts/                   # Layout components
├── components/                # Reusable components
├── composables/               # Vue composables
├── middleware/                # Route middleware
└── .env                       # Environment variables
```

## 🚀 Getting Started

### 1. Environment Setup

Make sure your `.env` file contains:

```env
MONGO_URI=mongodb+srv://admin123:admin112233@cluster0.r6nqvtb.mongodb.net/cms-dev?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NUXT_SECRET_KEY=your-super-secret-nuxt-key-change-this-in-production
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Start Development Server

```bash
yarn dev
```

The application will be available at `http://localhost:3002/`

### 4. Seed Database (First Time Setup)

```bash
curl -X POST http://localhost:3002/api/seed
```

This creates initial roles, permissions, users, and menus.

## 👥 Demo Accounts

After seeding, you can login with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| HR | hr@example.com | password123 |
| Accountant | accountant@example.com | password123 |
| Employee | employee@example.com | password123 |

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/me` - Get current user profile

### Menu System
- `GET /api/menus` - Get user's accessible menus

### Database
- `POST /api/seed` - Seed database with initial data

## 🔐 Role & Permission System

### Roles
- **Admin**: Full system access
- **HR**: User management, HR processes, payroll
- **Accountant**: Financial reports, analytics
- **Employee**: Basic dashboard access

### Permissions
- `view_dashboard` - View dashboard
- `view_users` - View users list
- `create_user` - Create new users
- `edit_user` - Edit user information
- `delete_user` - Delete users
- `view_reports` - View reports
- `create_report` - Create reports
- `manage_roles` - Manage roles and permissions
- `manage_system` - System administration
- `view_analytics` - View analytics
- `manage_hr` - HR management
- `manage_payroll` - Payroll management

## 🎛️ Available Scripts

```bash
yarn dev        # Start development server
yarn build      # Build for production
yarn preview    # Preview production build
yarn typecheck  # Run TypeScript checks
```

## 🔒 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: Middleware-based route guards
- **Role-Based Access**: Granular permission system
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for security

## 📖 Usage Examples

### Creating Protected Routes

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  roles: ['admin', 'hr'] // Only admin and hr can access
})
</script>
```

### Using Auth Composable

```vue
<script setup lang="ts">
const { user, isLoggedIn, hasRole, hasPermission, logout } = useAuth()

// Check if user has specific role
if (hasRole('admin')) {
  // Admin-only logic
}

// Check if user has specific permission
if (hasPermission('view_reports')) {
  // Show reports
}
</script>
```

### Fetching User Menus

```vue
<script setup lang="ts">
const { menus, fetchMenus } = useMenu()

// Fetch menus based on user role
await fetchMenus()
</script>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.