# Dashboard Structure Documentation

## Overview

The dashboard has been modularized into separate page components with independent data fetching and UI management. Each section handles its own state, API calls, and user interactions.

## Folder Structure

```
pages/dashboard/
├── index.vue                 # Main dashboard overview with stats and navigation
├── users.vue                # User management (existing)
├── products/
│   └── index.vue            # Product management page
├── orders/
│   └── index.vue            # Order management page
└── reports/
    └── index.vue            # Reports and analytics page

components/
├── dashboard/
│   └── DashboardCard.vue    # Reusable statistics card component
└── ProductFormModal.vue     # Product creation/editing modal

composables/
├── useDashboard.ts          # Dashboard overview data management
├── useProducts.ts           # Product CRUD operations
├── useOrders.ts             # Order management operations
└── useReports.ts            # Reports and analytics data
```

## Page Components

### 1. Dashboard Overview (`/dashboard`)
- **File**: `pages/dashboard/index.vue`
- **Purpose**: Main landing page with statistics cards and navigation
- **Features**:
  - Statistics overview (users, products, orders, revenue)
  - Quick navigation cards to other sections
  - Recent activity feed
  - Role-based access control for navigation items
- **Composable**: `useDashboard()`

### 2. Product Management (`/dashboard/products`)
- **File**: `pages/dashboard/products/index.vue`
- **Purpose**: Complete product catalog management
- **Features**:
  - Product listing with search and filters
  - Create/Edit/Delete products
  - Stock management
  - Status tracking (active/inactive/out-of-stock)
  - Pagination
- **Composable**: `useProducts()`
- **Modal**: `ProductFormModal.vue`

### 3. Order Management (`/dashboard/orders`)
- **File**: `pages/dashboard/orders/index.vue`
- **Purpose**: Track and manage customer orders
- **Features**:
  - Order listing with filters
  - Order status management
  - Customer information display
  - Order details modal
  - Time range filtering
- **Composable**: `useOrders()`

### 4. Reports & Analytics (`/dashboard/reports`)
- **File**: `pages/dashboard/reports/index.vue`
- **Purpose**: Business intelligence and reporting
- **Features**:
  - Key performance metrics
  - Revenue trends
  - Top products analysis
  - Sales by category
  - Customer insights
  - Export functionality
- **Composable**: `useReports()`

## Composables

### `useDashboard()`
**Location**: `composables/useDashboard.ts`

**Purpose**: Manages dashboard overview data including statistics and recent activity

**Key Features**:
- Fetches user count from real API
- Provides mock data for other statistics
- Recent activity timeline
- Error handling and loading states

**Usage**:
```typescript
const { 
  dashboardStats, 
  recentActivity, 
  loading, 
  error, 
  fetchDashboardData 
} = useDashboard()
```

### `useProducts()`
**Location**: `composables/useProducts.ts`

**Purpose**: Complete product management with CRUD operations

**Key Features**:
- Product listing with filtering
- Create, update, delete operations
- Search functionality
- Pagination support
- Error handling

**Usage**:
```typescript
const { 
  products, 
  loading, 
  error, 
  totalProducts,
  currentPage,
  totalPages,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = useProducts()
```

### `useOrders()`
**Location**: `composables/useOrders.ts`

**Purpose**: Order management and tracking

**Key Features**:
- Order listing with filters
- Status management
- Customer information
- Mock data implementation
- Time range filtering

**Usage**:
```typescript
const { 
  orders, 
  loading, 
  error, 
  totalOrders,
  fetchOrders,
  updateOrder
} = useOrders()
```

### `useReports()`
**Location**: `composables/useReports.ts`

**Purpose**: Analytics and reporting functionality

**Key Features**:
- Key performance indicators
- Revenue analytics
- Product performance metrics
- Customer insights
- Export capabilities

**Usage**:
```typescript
const { 
  reports, 
  loading, 
  error, 
  fetchReports,
  exportReports
} = useReports()
```

## Components

### DashboardCard
**Location**: `components/dashboard/DashboardCard.vue`

**Purpose**: Reusable statistics card with trend indicators

**Props**:
- `title`: Card title
- `value`: Main value to display
- `icon`: FontAwesome icon class
- `color`: DaisyUI color variant
- `trend`: Optional trend data with direction and percentage

**Usage**:
```vue
<DashboardCard
  title="Total Users"
  :value="dashboardStats.users"
  icon="fas fa-users"
  color="primary"
  :trend="dashboardStats.usersTrend"
/>
```

### ProductFormModal
**Location**: `components/ProductFormModal.vue`

**Purpose**: Modal form for creating and editing products

**Props**:
- `isOpen`: Boolean to control modal visibility
- `product`: Optional product data for editing

**Events**:
- `close`: Emitted when modal should be closed
- `product-created`: Emitted when a new product is created
- `product-updated`: Emitted when a product is updated

**Usage**:
```vue
<ProductFormModal
  :is-open="showCreateModal"
  @close="showCreateModal = false"
  @product-created="handleProductCreated"
/>
```

## Data Flow

1. **Dashboard Overview**: Fetches aggregated statistics and displays navigation cards
2. **Individual Pages**: Each page manages its own data independently
3. **Composables**: Handle API communication and state management
4. **Components**: Reusable UI elements with prop-based configuration

## API Integration

### Current Status
- **Users**: Connected to real MongoDB API
- **Products**: Uses mock data structure ready for API integration
- **Orders**: Uses mock data structure ready for API integration
- **Reports**: Uses mock data structure ready for API integration

### API Endpoints (Future Implementation)
```
GET    /api/products              # List products with filters
POST   /api/products              # Create new product
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Delete product

GET    /api/orders                # List orders with filters
POST   /api/orders                # Create new order
PUT    /api/orders/:id            # Update order
DELETE /api/orders/:id            # Delete order

GET    /api/reports               # Get reports data
GET    /api/reports/export        # Export reports
```

## Role-Based Access Control

The dashboard implements role-based navigation:

- **Admin**: Full access to all sections
- **HR**: Access to users and dashboard
- **Accountant**: Access to reports and dashboard
- **Employee**: Basic dashboard access

## Styling

All components use DaisyUI with the Cupcake theme for consistent styling:
- Cards with shadows for content sections
- Stats components for metrics display
- Tables with hover effects
- Modal dialogs for forms
- Loading spinners and error states

## Future Enhancements

1. **Real API Integration**: Replace mock data with actual API endpoints
2. **Chart Visualization**: Integrate Chart.js or similar for reports
3. **Real-time Updates**: WebSocket integration for live data
4. **Advanced Filtering**: More sophisticated filter options
5. **Bulk Operations**: Select multiple items for batch actions
6. **Export Features**: PDF/CSV export functionality
7. **Audit Logging**: Track user actions and changes