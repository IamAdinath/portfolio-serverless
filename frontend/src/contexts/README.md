# Streamlined Authentication System

This directory contains the streamlined authentication system for the portfolio application.

## Components

### AuthContext.tsx
- **Purpose**: Centralized authentication state management
- **Features**:
  - Login/Register functionality
  - Auto token management
  - User session persistence
  - Logout handling

### Key Features

1. **Automatic Token Management**
   - Stores JWT tokens in localStorage
   - Automatically includes auth headers in API calls
   - Handles token refresh and validation

2. **User State Management**
   - Tracks authentication status
   - Provides user information
   - Loading states for auth operations

3. **Route Protection**
   - ProtectedRoute component for securing pages
   - Automatic redirect to login when needed
   - Return to intended page after login

## Usage

### 1. Wrap your app with AuthProvider

```tsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

### 2. Use the auth hook in components

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.username}!</div>;
}
```

### 3. Protect routes

```tsx
import ProtectedRoute from '../components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/public" element={<PublicPage />} />
      <Route path="/writer" element={
        <ProtectedRoute>
          <WriterPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

## API Integration

The auth system automatically:
- Adds `Authorization: Bearer <token>` headers to authenticated requests
- Handles token expiration
- Redirects to login when authentication fails

## Environment Variables

Required in your `.env` file:
```
REACT_APP_COGNITO_USER_POOL_ID=your-pool-id
REACT_APP_COGNITO_CLIENT_ID=your-client-id
REACT_APP_COGNITO_REGION=your-region
REACT_APP_COGNITO_DOMAIN=your-cognito-domain
REACT_APP_COGNITO_REDIRECT_SIGNIN=http://localhost:3000/callback
REACT_APP_COGNITO_REDIRECT_SIGNOUT=http://localhost:3000/logout
```