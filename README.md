# System Inventory Frontend

A comprehensive React-based frontend application for inventory management with authentication, sales, and reporting capabilities, built with **React + TypeScript + Vite**.

## Features

- **Authentication System**: Complete login/register functionality with protected routes
- **Role-Based Access Control**: Admin and Vendedor roles with different permissions
- **User Management**: Full CRUD operations for user management (admin only)
- **Inventory Management**: Complete product and supplier management
- **Purchase Management**: Purchase orders and supplier relationships
- **Sales Management**: Client management and sales processing
- **Reporting System**: Sales, purchases, and stock reports
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Beautiful and intuitive interface
- **State Management**: Efficient state management with Zustand and React Context

## Autor
- Ezequiel Campos - full stack developer
- https://github.com/kyxent-Immortal-Dev
- https://portafolio-ezequiel-campos.netlify.app

## Tech Stack

- **Frontend library**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **State Management**: Zustand + React Context
- **Routing**: React Router DOM
- **Package Manager**: Bun
- **Development**: ESLint + TypeScript

## Requirements

- Node.js 20+
- Bun (or npm/yarn)
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kyxent-Immortal-Dev/Frontend-Code-Castle-technical-test.git
cd frontend
```

2. Install Bun (if you don't have it):
```bash
npm install -g bun
```

3. Install dependencies:
```bash
bun install
```

4. Copy environment file:
```bash
cp env.example .env
```

5. Configure your environment variables in `.env`:
```env
VITE_BACKEND_URL="http://localhost:8000/api"
VITE_NODE_ENV='development'
```

6. Start the development server:
```bash
bun run dev
```

The application will be available at: `http://localhost:5173`

## Default Users

Use these accounts to test the application:

- **Admin**: `h.ezequiel.z.campos@codecastle.com` / `admin123`
- **Vendedor**: `vendedor@codecastle.com` / `vendedor123`

## Project Structure

```
src/
├── components/
│   ├── atoms/                    # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ModalComponent.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── Toast.tsx
│   ├── auth/                     # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── clients/                  # Client management
│   │   ├── ClientDetails.tsx
│   │   ├── ClientListComponent.tsx
│   │   ├── CreateUpdateClient.tsx
│   │   ├── DeleteConfirmation.tsx
│   │   └── ViewMobileClients.tsx
│   ├── home/                     # Home page components
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── products/                 # Product management
│   │   ├── CreateUpdateProduct.tsx
│   │   ├── DeleteConfirmation.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── ProductListComponent.tsx
│   │   └── ViewMobileProducts.tsx
│   ├── purchases/                # Purchase management
│   │   ├── CreateUpdatePurchase.tsx
│   │   ├── DeleteConfirmation.tsx
│   │   ├── PurchaseDetails.tsx
│   │   ├── PurchaseListComponent.tsx
│   │   ├── PurchasesBySupplierReportForm.tsx
│   │   ├── PurchaseStats.tsx
│   │   ├── PurchaseStatusManager.tsx
│   │   └── ViewMobilePurchases.tsx
│   ├── sales/                    # Sales management
│   │   ├── CreateUpdateSales.tsx
│   │   ├── DeleteConfirmation.tsx
│   │   ├── SaleDetails.tsx
│   │   ├── SalesListComponent.tsx
│   │   ├── SalesReportForm.tsx
│   │   └── ViewMobileSales.tsx
│   ├── suppliers/                # Supplier management
│   │   ├── CreateUpdateSupplier.tsx
│   │   ├── DeleteConfirmation.tsx
│   │   ├── SupplierDetails.tsx
│   │   ├── SuppliersListComponent.tsx
│   │   └── ViewMobileSuppliers.tsx
│   └── users/                    # User management
│       ├── CreateUpdateUser.tsx
│       ├── DeleteConfirmation.tsx
│       ├── UserDetails.tsx
│       ├── UsersListComponent.tsx
│       └── ViewMobileUsers.tsx
├── context/                      # React Context providers
│   ├── Products/
│   │   ├── ProductsContext.tsx
│   │   └── ProductsContextValue.ts
│   ├── purchases/
│   │   ├── PurchasesContext.tsx
│   │   └── PurchasesContextValue.ts
│   ├── suppliers/
│   │   ├── SuppliersContext.tsx
│   │   └── SuppliersContextValue.ts
│   └── users/
│       ├── UsersContext.tsx
│       └── UsersContextValue.ts
├── guards/                       # Route protection
│   ├── Auth.guard.protected.tsx
│   └── Auth.guard.public.tsx
├── hooks/                        # Custom React hooks
│   ├── useProductsContext.ts
│   ├── usePurchasePermissions.ts
│   ├── usePurchasesContext.ts
│   ├── useSuppliersContext.ts
│   ├── useThemeEffect.ts
│   └── useUsersContext.ts
├── interfaces/                    # TypeScript interfaces
│   ├── auth/
│   │   ├── LoginI.ts
│   │   ├── LogoutI.ts
│   │   ├── ProfileI.ts
│   │   ├── RefreshI.ts
│   │   └── RegisterI.ts
│   ├── inventary/
│   │   ├── Product.interface.ts
│   │   ├── Purchases.interface.ts
│   │   └── Supliers.interface.ts
│   ├── sales/
│   │   ├── Client.interfaces.ts
│   │   ├── CreateUpdateSale.interfaces.ts
│   │   └── Sales.interfaces.ts
│   └── users/
│       └── Users.Interfaces.ts
├── layouts/                      # Application layouts
│   └── AppLayout.tsx
├── pages/                        # Page components
│   ├── ClientPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── ProductPage.tsx
│   ├── PurchasePage.tsx
│   ├── RegisterPage.tsx
│   ├── SalesPage.tsx
│   ├── SupplierPage.tsx
│   └── UsersPage.tsx
├── routes/                       # Application routing
│   └── App.routes.tsx
├── services/                     # API services
│   ├── api/
│   │   ├── Auth.service.ts
│   │   ├── Client.service.ts
│   │   ├── Product.service.ts
│   │   ├── Purchase.service.ts
│   │   ├── Sales.service.ts
│   │   ├── Supplier.service.ts
│   │   ├── User.service.ts
│   │   └── and more...
│   └── htttp.client.service.ts
├── store/                        # State management
│   ├── useAuth.service.ts
│   ├── useClient.service.ts
│   ├── useSale.service.ts
│   └── useTheme.store.ts
├── utils/                        # Utility functions
│   ├── FormatDate.ts
│   └── NumberUtils.ts
├── App.tsx                       # Main application component
├── main.tsx                      # Application entry point
└── index.css                     # Global styles
```

## System Modules

### 🔐 Authentication Module
- User registration and login forms
- Protected route guards
- Token-based authentication
- Role-based access control

### 📦 Inventory Module
- **Products**: Full CRUD operations with responsive design
- **Suppliers**: Supplier information management
- **Purchases**: Purchase order processing and tracking

### 💰 Sales Module
- **Clients**: Customer relationship management
- **Sales**: Sales processing and order management
- **Reports**: Sales analytics and reporting

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach
- **Theme Support**: Light/dark mode toggle
- **Component Library**: Reusable atomic components
- **Form Validation**: React Hook Form integration
- **Toast Notifications**: User feedback system

## Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript type checking
```

### Code Organization

- **Components**: Organized by feature/module
- **Hooks**: Custom React hooks for business logic
- **Context**: React Context for state management
- **Services**: API integration layer
- **Interfaces**: TypeScript type definitions
- **Utils**: Helper functions and utilities

### State Management

- **Zustand**: Lightweight state management for global state
- **React Context**: Component-level state sharing
- **Custom Hooks**: Encapsulated business logic

## Backend Integration

This frontend connects to the [System Inventory API](https://github.com/kyxent-Immortal-Dev/Backend-Code-Castle-technical-test) backend.

### API Configuration

- Base URL: `VITE_BACKEND_URL` environment variable
- Authentication: Bearer token in Authorization header
- Error Handling: Centralized error handling with toast notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Author

- **Ezequiel Campos** - Full Stack Developer
- GitHub: [@kyxent-Immortal-Dev](https://github.com/kyxent-Immortal-Dev)

## Repository

This project is hosted at: [https://github.com/kyxent-Immortal-Dev/Frontend-Code-Castle-technical-test](https://github.com/kyxent-Immortal-Dev/Frontend-Code-Castle-technical-test)

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
