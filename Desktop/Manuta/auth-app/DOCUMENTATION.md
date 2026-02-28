# Login and Registration Flow Application

A complete authentication system built with Next.js, React, and TypeScript featuring a login page, registration page, and account setup flow.

## Features

- **Login Page** (`/login`): Authenticate existing users with email and password
- **Registration Page** (`/register`): Create new accounts with email, password, and password confirmation
- **Account Setup Page** (`/setup`): Complete user profile after registration with:
  - Profile photo upload (optional)
  - First name and last name
- **Homepage** (`/`): Personalized dashboard for authenticated users showing profile information
- **Protected Routes**: Automatic redirects for unauthenticated users
- **Persistent State**: User data stored in browser localStorage (for demo purposes)

## Project Structure

```
c:\Users\Student\Desktop\Manuta\auth-app\
├── src/
│   ├── app/
│   │   ├── page.tsx                # Homepage (requires login)
│   │   ├── login/page.tsx          # Login page
│   │   ├── register/page.tsx       # Registration page
│   │   ├── setup/page.tsx          # Account setup page
│   │   ├── layout.tsx              # Root layout with AuthProvider
│   │   └── globals.css             # Global Tailwind styles
│   ├── contexts/
│   │   └── AuthContext.tsx         # Authentication context and useAuth hook
│   └── types/
│       └── auth.ts                 # TypeScript types for auth
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
└── README.md                        # Original template README
```

## Authentication Flow

### New User Registration
1. User navigates to `/register`
2. Fills in email, password, and confirm password fields
3. Password validation:
   - Must be at least 6 characters
   - Password and confirm password must match
4. Email validation:
   - Cannot register with an email already in the system
5. On successful registration:
   - User account is created and stored in localStorage
   - User is redirected to `/setup`

### Account Setup (Post-Registration)
1. User is on `/setup` page after registration
2. User can optionally upload a profile photo:
   - Click "Choose File" to select an image
   - Preview appears above the upload field
3. User enters first name and last name (required)
4. On submission:
   - Profile information is saved
   - `setupComplete` flag is set to true
   - User is redirected to `/` (homepage)

### Login for Existing Users
1. Existing users navigate to `/login`
2. Enter registered email and password
3. System validates credentials against stored users
4. On successful authentication:
   - User data is loaded from localStorage
   - User is redirected to `/` (homepage)

### Logout
1. Click "Logout" button on homepage
2. User session is cleared
3. User is redirected to `/login`

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm (comes with Node.js)

### Installation & Running

1. Navigate to the project directory:
```bash
cd c:\Users\Student\Desktop\Manuta\auth-app
```

2. The development server should already be running. If not, start it:
```bash
npm run dev
```

3. Open your browser and go to:
```
http://localhost:3000
```

### Available Commands

```bash
# Start development server (default: http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint to check code quality
npm run lint
```

## Pages & Components Detailed

### 1. Login Page (`/login`)

**URL**: `http://localhost:3000/login`

**Fields**:
- Email (required, type: email)
- Password (required, type: password, min 6 characters)

**Features**:
- Form validation with error messages
- "Don't have an account?" link to registration
- Responsive design with blue gradient background
- Loading state during authentication

**Test Credentials** (after registering):
- Any email you registered with
- The password you set during registration

### 2. Registration Page (`/register`)

**URL**: `http://localhost:3000/register`

**Fields**:
- Email (required, type: email)
- Password (required, type: password, min 6 characters)
- Confirm Password (required, type: password, must match password)

**Validation Rules**:
- Email must be unique (not already registered)
- Password must be at least 6 characters
- Password and confirm password must match
- All fields are required

**Features**:
- Form validation with error messages
- "Already have an account?" link to login
- Responsive design with green gradient background
- Loading state during registration

**Example Test Flow**:
1. Email: `user@example.com`
2. Password: `Password123`
3. Confirm Password: `Password123`
4. Click "Register" → redirects to Setup page

### 3. Account Setup Page (`/setup`)

**URL**: `http://localhost:3000/setup` (accessed after successful registration)

**Fields**:
- Profile Photo (optional, accepts image files)
- First Name (required, type: text)
- Last Name (required, type: text)

**Features**:
- Profile photo preview with circular display
- Fallback avatar with user initials if no photo uploaded
- File input for image upload
- First and last name validation
- Responsive design with purple/pink gradient background
- Loading state during setup completion

**Test Flow**:
1. Upload an image (optional)
2. Enter First Name: `John`
3. Enter Last Name: `Doe`
4. Click "Complete Setup" → redirects to Homepage

### 4. Homepage (`/`)

**URL**: `http://localhost:3000/` (accessible only when logged in)

**Features**:
- User profile display with avatar or initials
- User's full name and email
- Account status indicator
- Logout button
- Quick links section (Settings, Profile, Preferences)
- Responsive grid layout

**Protection**:
- Automatically redirects to `/login` if user is not authenticated
- Shows loading state while checking authentication

## Authentication Context & Hook

### AuthContext Overview

The `AuthContext` manages all authentication state and operations.

**Location**: `src/contexts/AuthContext.tsx`

**Exported Items**:
- `AuthProvider` - React component that wraps your app
- `useAuth()` - Hook to access auth state and methods

### Type Definitions

**Location**: `src/types/auth.ts`

```typescript
interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  setupComplete: boolean;
}

interface AuthContextType {
  user: User | null;           // Current user or null if not logged in
  isLoading: boolean;           // Loading state during auth operations
  login: (email, password) => Promise<void>;        // Login function
  register: (email, password) => Promise<void>;     // Register function
  completeSetup: (data) => void;                     // Complete profile setup
  logout: () => void;           // Logout function
}
```

### Using the Auth Hook

**Example**:
```typescript
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Please log in</p>;

  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Data Storage & Persistence

### Current Implementation (Demo)

The application uses **browser localStorage** for data storage:
- **Key**: `'users'`
- **Format**: JSON object with emails as keys

**Example localStorage content**:
```json
{
  "user@example.com": {
    "email": "user@example.com",
    "password": "Password123",
    "firstName": "John",
    "lastName": "Doe",
    "profilePhoto": "data:image/...",
    "setupComplete": true
  }
}
```

### Production Recommendations

For a production application, you should:

1. **Replace localStorage with API calls**:
   - Use fetch or axios to communicate with backend
   - Send credentials to `/api/login` endpoint
   - Send registration data to `/api/register` endpoint

2. **Implement secure authentication**:
   - Use HTTP-only cookies for tokens
   - Implement JWT or session-based auth
   - Never store passwords in localStorage

3. **Backend validation**:
   - Validate all inputs on the server
   - Hash passwords using bcrypt or similar
   - Implement rate limiting for login attempts
   - Check email uniqueness before registration

4. **Add security measures**:
   - HTTPS only
   - CORS configuration
   - CSRF protection
   - XSS prevention

## Styling & Design

### Tailwind CSS

The application uses **Tailwind CSS v4** for all styling.

**Color Schemes by Page**:
- **Login**: Blue gradient (`from-blue-500 to-purple-600`)
- **Register**: Green gradient (`from-green-500 to-teal-600`)
- **Setup**: Purple/Pink gradient (`from-purple-500 to-pink-600`)
- **Homepage**: Blue to Purple gradient (`from-blue-50 to-purple-50`)

**Responsive Breakpoints**:
- Mobile: Default styles
- Tablet/Desktop (md): Enhanced layouts with grid columns

### Component Styling

- **Buttons**: With hover states and disabled states
- **Input Fields**: With focus rings and border
- **Forms**: Vertical layout with spacing
- **Cards**: Rounded with shadow effects
- **Images**: Optimized with Next.js Image component

## Testing the Application

### Manual Test Scenarios

**Scenario 1: New User Registration & Setup**
```
1. Go to http://localhost:3000/
2. Redirected to /login
3. Click "Register here" → /register page
4. Enter: email=test@test.com, password=Test123, confirm=Test123
5. Click "Register" → /setup page
6. Enter: firstName=Test, lastName=User, upload optional photo
7. Click "Complete Setup" → Homepage
8. Verify user info is displayed
```

**Scenario 2: Login with Existing Account**
```
1. On Homepage, click "Logout"
2. Redirected to /login
3. Enter the same email: test@test.com
4. Enter the same password: Test123
5. Click "Login" → Homepage
6. Verify user info matches
```

**Scenario 3: Protected Routes**
```
1. Open browser console and clear localStorage
2. Try to access http://localhost:3000/ → redirects to /login
3. Try to access http://localhost:3000/setup → redirects to /login
```

**Scenario 4: Validation**
```
1. On /register page
2. Try passwords that don't match → Error message
3. Try password less than 6 chars → Error message
4. Try registering same email twice → Error message
5. On /login with wrong password → Error message
```

## Development Notes

### Key Technologies
- **Next.js 16.1.6** - React framework with file-based routing
- **React 19.2.3** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS
- **Context API** - State management

### Performance Optimizations
- Next.js static pre-rendering for public pages
- Image optimization with Next.js Image component
- Code splitting per route
- Turbopack for fast builds

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

**Issue**: "location is not defined" error during build
**Solution**: Ensure all router operations are inside `useEffect` hook, not during render

**Issue**: Data not persisting after page refresh
**Solution**: This is expected if using a fresh browser session. Clear localStorage to reset: `localStorage.clear()` in console

**Issue**: Form submission not working
**Solution**: Ensure JavaScript is enabled in browser, check console for errors

**Issue**: Images not displaying
**Solution**: The Image component requires `width` and `height` properties (unless using `fill`)

## Future Enhancement Ideas

1. **Authentication Features**:
   - Password reset via email
   - Email verification
   - Social login (Google, GitHub)
   - Two-factor authentication
   - Remember me functionality

2. **User Management**:
   - Edit profile information
   - Change password
   - Account deletion
   - Activity logs

3. **Security**:
   - Rate limiting
   - IP whitelist/blacklist
   - Suspicious login detection
   - Session timeout

4. **UI/UX**:
   - Dark mode support
   - Mobile app version
   - Accessibility improvements
   - Loading skeleton screens
   - Toast notifications

5. **Backend Integration**:
   - REST API endpoints
   - Database integration (PostgreSQL, MongoDB)
   - Email service integration
   - File upload handling

## File Locations

- **Homepage**: [src/app/page.tsx](src/app/page.tsx)
- **Login Page**: [src/app/login/page.tsx](src/app/login/page.tsx)
- **Register Page**: [src/app/register/page.tsx](src/app/register/page.tsx)
- **Setup Page**: [src/app/setup/page.tsx](src/app/setup/page.tsx)
- **Auth Context**: [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)
- **Auth Types**: [src/types/auth.ts](src/types/auth.ts)
- **Layout**: [src/app/layout.tsx](src/app/layout.tsx)

## License

MIT License - Feel free to use this project for learning and development purposes.
