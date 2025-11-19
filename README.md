# Real Estate Listings App

A modern real estate property listings application built with Next.js 14+, TypeScript, and Tailwind CSS. This full-stack application connects to a .NET backend API for complete CRUD operations and real-time data management.

## Features

- ✨ **Add Properties** - Create new property listings with details, images, and categorization
- �️ **Image Upload** - Upload property images directly (up to 5MB)
- �📋 **List Properties** - Responsive grid layout displaying all properties
- 🔍 **Advanced Filtering** - Server-side filtering by name, address, price range, type, and status
- 👁️ **View Details** - Modal view with complete property information
- 🗑️ **Delete Properties** - Remove listings with confirmation
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🔄 **Real-time API Integration** - Full CRUD operations with .NET backend
- ⚡ **Loading States** - Smooth loading indicators for better UX
- 🚨 **Error Handling** - Comprehensive error handling with retry functionality
- 🚀 **Server-side Filtering** - Efficient filtering handled by backend API
- ✅ **Backend Testing** - Comprehensive NUnit test suite for API reliability

## Tech Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **State**: React hooks (useState, useMemo, useEffect)
- **API Client**: Fetch API with custom service layer

### Backend (Required)

- **.NET 8.0** backend with REST API
- **MongoDB** database for data storage
- **NUnit** testing framework for backend tests
- Endpoints for properties, categories CRUD operations, and image upload

## Project Structure

```
src/
├── app/
│   ├── page.tsx               # Main listing page (client component)
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
|   └── __tests__/ 
│         ├── PropertyCard.tsx       # Property display card
│         ├── AddPropertyForm.tsx    # Form to add new properties
│         ├── PropertyFilter.tsx     # Filter controls
│         ├── LoadingSpinner.tsx     # Loading state component
│         └── ErrorMessage.tsx       # Error display component
├── lib/
│   └── api/
│       └── __tests__/
│             ├── config.ts          # API configuration
│             ├── types.ts           # API response types
│             └── propertyService.ts # API service layer
|   └── utils/                       # utility functions for error handling
├── types/
│   └── index.ts               # TypeScript interfaces
└── data/
    ├── properties.json        # Sample property data (for reference)
    └── categories.json        # Sample category data (for reference)
```

## Data Structure

### Property Interface

```typescript
{
  id: string;
  name: string;
  description: string;
  addressProperty: string;
  type: string;
  priceProperty: number;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  idOwner?: string;
}
```

### Category Interface

```typescript
{
  id: string;
  name: string;
  color: string;
}
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- .NET 8.0 SDK installed
- MongoDB installed and running (or MongoDB Atlas account)
- .NET backend API running (default: http://localhost:5000)

### Backend Setup

The backend is located at `/Users/doquendob/Documents/million_backend/`

1. **Start MongoDB**

   ```bash
   # macOS
   brew services start mongodb-community@7.0

   # Or use MongoDB Atlas cloud database
   ```

2. **Configure backend**

   Edit `appsettings.json` or `appsettings.Development.json`:

   ```json
   {
     "MongoDbSettings": {
       "ConnectionString": "mongodb://localhost:27017",
       "DatabaseName": "RealEstateDb"
     }
   }
   ```

3. **Run the backend**

   ```bash
   cd /Users/doquendob/Documents/million_backend
   dotnet restore
   dotnet run
   ```

   Backend will start at http://localhost:5000

4. **Run backend tests** (optional)

   ```bash
   cd /Users/doquendob/Documents/MillionBackend.Tests
   dotnet test
   ```

   See [TESTING.md](/Users/doquendob/Documents/million_backend/TESTING.md) for details.

### Frontend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd million_frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and set your API URL:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

   Run Frontend Tests (Jest)

4. **The frontend uses Jest + React Testing Library for component and API unit tests**.

To run all tests:

```npm test
# or
yarn test
# or
pnpm test
# or
bun test```


To run tests in watch mode (recommended during development):

```npm test -- --watch```


To generate a coverage report:

```npm test -- --coverage```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## API Integration

### Backend Requirements

Your .NET backend should implement the following endpoints:

#### Properties Endpoints

```
GET    /api/properties          # Get all properties
GET    /api/properties/{id}     # Get property by ID
POST   /api/properties          # Create new property
PUT    /api/properties/{id}     # Update property
DELETE /api/properties/{id}     # Delete property
```

#### Categories Endpoints

```
GET    /api/categories          # Get all categories
```

### Request/Response Examples

**Create Property (POST /api/properties)**

```json
{
  "name": "Modern Downtown Loft",
  "description": "Beautiful loft in downtown...",
  "addressProperty": "123 Main St, City, State",
  "type": "Apartment",
  "priceProperty": 500000,
  "imageUrl": "https://example.com/image.jpg",
  "active": true,
  "idOwner": "user-123"
}
```

**Response**

```json
{
  "id": "prop-uuid-here",
  "name": "Modern Downtown Loft",
  "description": "Beautiful loft in downtown...",
  "addressProperty": "123 Main St, City, State",
  "type": "Apartment",
  "priceProperty": 500000,
  "imageUrl": "https://example.com/image.jpg",
  "active": true,
  "createdAt": "2025-11-18T10:30:00Z",
  "idOwner": "user-123"
}
```

### API Service Layer

The app uses a centralized API service (`lib/api/propertyService.ts`) with:

- ✅ Automatic error handling
- ✅ Type-safe requests and responses
- ✅ Singleton pattern for efficient resource usage
- ✅ Support for both wrapped and unwrapped API responses
- ✅ Consistent error format across the app

### CORS Configuration

Ensure your .NET backend has CORS enabled for the frontend URL:

```csharp
// In your .NET Startup.cs or Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

app.UseCors("AllowFrontend");
```

````

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Adding a Property**: Click "Add New Property" button at the top and fill out the form
2. **Filtering**: Use the filter panel to narrow down properties by various criteria
3. **Viewing Details**: Click the "View" button on any property card to see full details
4. **Deleting**: Click the delete (trash) icon and confirm to remove a property

All operations are persisted to the backend API in real-time.

## Component Overview

### PropertyCard

Displays property information in a card format with:

- Property image with fallback
- Type and status badges
- Name, address, and price
- View and delete action buttons

### AddPropertyForm

Collapsible form for creating new properties with:

- Form validation (required fields)
- Type selection dropdown
- Active status toggle
- Auto-clear on submit
- Loading state during API call

### PropertyFilter

Filter controls including:

- Text search (name and address)
- Price range inputs (min/max)
- Category pills with custom colors
- Active/inactive status filter
- Clear all filters button

### LoadingSpinner

Reusable loading indicator with:

- Multiple size options (sm, md, lg)
- Optional loading text
- Smooth animation

### ErrorMessage

Error display component with:

- Clear error message
- Retry functionality
- Consistent styling

## Best Practices Implemented

### API Layer
- **Separation of Concerns**: API logic separated from UI components
- **Error Handling**: Centralized error handling with typed errors
- **Type Safety**: Full TypeScript support for requests and responses
- **Flexibility**: Supports both wrapped (`{data: T}`) and unwrapped responses
- **Configuration**: Environment-based API URL configuration

### State Management
- **Loading States**: Proper loading indicators during async operations
- **Error States**: User-friendly error messages with retry options
- **Optimistic Updates**: Immediate UI feedback with API validation

### Code Organization
- **Service Layer**: Centralized API calls in `propertyService.ts`
- **Type Definitions**: Shared types in dedicated files
- **Component Reusability**: Modular, reusable components
- **Environment Config**: Externalized configuration via environment variables

## Troubleshooting

### API Connection Issues

**Problem**: "Failed to load data" error on page load

**Solutions**:
1. Verify .NET backend is running: `dotnet run`
2. Check API URL in `.env.local` matches your backend
3. Ensure CORS is properly configured in .NET backend
4. Check browser console for detailed error messages

### CORS Errors

**Problem**: CORS policy blocking requests

**Solution**: Add CORS configuration to your .NET backend (see API Integration section above)

### Environment Variables Not Loading

**Problem**: API calls going to wrong URL

**Solutions**:
1. Ensure file is named `.env.local` (not `.env.local.example`)
2. Restart the Next.js dev server after changing env variables
3. Verify variable name starts with `NEXT_PUBLIC_`

## Development vs Production

### Development
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
````

### Production

```bash
# .env.production or configured in hosting platform
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript language reference
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [.NET Web API](https://learn.microsoft.com/en-us/aspnet/core/web-api/) - .NET backend API development

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

**Important**: When deploying, add the `NEXT_PUBLIC_API_URL` environment variable in Vercel's project settings pointing to your production .NET API.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is for educational purposes.
