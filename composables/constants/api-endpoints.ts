// Auth Service
export const apiLogin = "/api/auth/login"
export const apiLogout = "/api/auth/logout"
export const apiRegister = "/api/auth/register"
export const apiMe = "/api/user/me"

// User Management
export const apiUsers = "/api/users"
export const apiUserCreate = "/api/user/create"
export const apiUserDelete = (id: string) => `/api/user/${id}`

// Menu System
export const apiMenus = "/api/menus"

// Dashboard
export const apiDashboard = "/api/dashboard"

// Products
export const apiProducts = "/api/products"
export const apiProductCreate = "/api/products"
export const apiProductUpdate = (id: string) => `/api/products/${id}`
export const apiProductDelete = (id: string) => `/api/products/${id}`

// Orders
export const apiOrders = "/api/orders"
export const apiOrderCreate = "/api/orders"
export const apiOrderUpdate = (id: string) => `/api/orders/${id}`
export const apiOrderDelete = (id: string) => `/api/orders/${id}`

// Reports
export const apiReports = "/api/reports"
export const apiReportsSales = "/api/reports/sales"
export const apiReportsInventory = "/api/reports/inventory"