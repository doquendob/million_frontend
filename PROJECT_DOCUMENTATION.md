# Million Real Estate - Full Stack Project Documentation

**Last Updated**: November 18, 2025

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design](#architecture--design)
3. [Technology Stack](#technology-stack)
4. [Key Features](#key-features)
5. [Running the Project](#running-the-project)
6. [Testing](#testing)
7. [API Documentation](#api-documentation)

---

## 🎯 Project Overview

**Million Real Estate** is a modern full-stack web application for managing property listings, built with .NET 8.0, MongoDB, and Next.js 14+.

### Core Functionality

- Browse property listings with server-side filtering
- Add/edit/delete properties with image upload
- Filter by name, address, price range, and type
- Responsive design for all devices
- Real-time search with debouncing (500ms)
- Image upload with drag-drop support

---

## 🏗️ Architecture & Design

### System Architecture

```
┌──────────────────┐     HTTP/REST API      ┌───────────────────┐
│                  │◄────────────────────────►│                   │
│  Next.js 14+     │    JSON (debounced)     │   .NET 8.0        │
│  Frontend        │    CORS Enabled         │   Web API         │
│  (Port 3000)     │                         │   (Port 5000)     │
│                  │                         │                   │
│  - React 18      │                         │  - Controllers    │
│  - TypeScript    │                         │  - Repositories   │
│  - Tailwind CSS  │                         │  - DTOs           │
│  - API Service   │                         │  - Validation     │
└──────────────────┘                         └───────────────────┘
         │                                            │
         │                                            │
         │ Static Assets (Images)                     ▼
         │                                   ┌──────────────────┐
         └────────────────────────────────────►                  │
                                              │   MongoDB 7.0    │
                                              │   Database       │
                                              │   (Port 27017)   │
                                              │                  │
                                              │  - Properties    │
                                              │  - Categories    │
                                              └──────────────────┘

                        ┌──────────────────────┐
                        │  MillionBackend.Tests │
                        │  (Separate Project)   │
                        │                       │
                        │  - NUnit 4.0.1        │
                        │  - Moq 4.20.70        │
                        │  - All Tests Passing  │
                        └──────────────────────┘
```

### Design Patterns

**Backend:**

- Repository Pattern (IPropertyRepository → PropertyRepository)
- DTO Pattern (PropertyInputDto, PropertyResponseDto)
- Dependency Injection

**Frontend:**

- Service Layer (centralized API service)
- Component Composition (reusable UI components)
- Custom Hooks (state management)

---

## 🛠️ Technology Stack

### Frontend

- **Next.js 14+** (App Router) - React framework with SSR/SSG
- **TypeScript 5.x** - Type-safe JavaScript
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **React 18+** - UI library

### Backend

- **ASP.NET Core 8.0** - Web API framework
- **C# 12** - Programming language
- **MongoDB.Driver 2.23.1** - Database driver
- **Swashbuckle (Swagger)** - API documentation

### Database

- **MongoDB 7.0** - NoSQL document database

### Testing

- **NUnit 4.0.1** - Unit testing framework
- **Moq 4.20.70** - Mocking library

---

## ✨ Key Features

### Property Management

- Create, read, update, delete properties
- Image upload (5MB max, jpg/png/gif/webp)
- Image preview and drag-drop support
- Form validation (frontend and backend)

### Advanced Filtering

- Server-side filtering by name, address, price range, type, status
- Case-insensitive partial text search
- Debounced requests (500ms) for performance
- Clear all filters option

### User Experience

- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Empty states with helpful messages
- Property details modal
- Newest properties first

### Developer Features

- Swagger UI for API documentation
- Type-safe TypeScript throughout
- Comprehensive error logging
- CORS configured for local development

---

## � Running the Project

### Prerequisites

- .NET 8.0 SDK
- Node.js 18+ and npm
- MongoDB 7.0 (local or Atlas)

### Backend Setup

```bash
# Navigate to backend directory
cd /Users/doquendob/Documents/million_backend

# Install dependencies
dotnet restore

# Set environment to Development (for Swagger UI)
export ASPNETCORE_ENVIRONMENT=Development

# Run the API
dotnet run

# API runs on: http://localhost:5000
# Swagger UI: http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd /Users/doquendob/Documents/million_frontend

# Install dependencies
npm install

# Run development server
npm run dev

# App runs on: http://localhost:3000
```

### MongoDB Setup

**Option 1: Local MongoDB**

```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community@7.0

# Connection string: mongodb://localhost:27017
```

**Option 2: MongoDB Atlas**

- Create free cluster at mongodb.com/atlas
- Update connection string in `appsettings.json`

### Environment Variables

**Backend** (`appsettings.json`):

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "RealEstateDb"
  }
}
```

**Frontend** (`.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## ✅ Testing

### Test Structure

```
/MillionBackend.Tests (Separate Project)
├── Controllers/
│   ├── PropertiesControllerTests.cs
│   ├── CategoriesControllerTests.cs
│   └── UploadControllerTests.cs
└── MillionBackend.Tests.csproj
```

**Status:** ✅ All tests passing

### Tools

- **NUnit 4.0.1** - Testing framework
- **Moq 4.20.70** - Mocking library
- **Microsoft.NET.Test.Sdk 17.8.0** - Test adapter

### Running Tests

```bash
cd /Users/doquendob/Documents/MillionBackend.Tests
dotnet test
```

### Test Coverage

- Controller unit tests with mocked repositories
- CRUD operation tests
- Filter logic tests
- Error scenario tests
- HTTP status code validation

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Swagger UI

```
http://localhost:5000
```

### Endpoints

#### Properties

**GET** `/api/properties`

- Get all properties with optional filters
- Query Parameters:
  - `name` (string): Filter by property name
  - `address` (string): Filter by address
  - `priceMin` (decimal): Minimum price
  - `priceMax` (decimal): Maximum price
  - `type` (string): Property type
  - `active` (boolean): Active status

**GET** `/api/properties/{id}`

- Get single property by ID

**POST** `/api/properties`

- Create new property

**PUT** `/api/properties/{id}`

- Update existing property

**DELETE** `/api/properties/{id}`

- Delete property

#### Categories

**GET** `/api/categories`

- Get all property types

#### Upload

**POST** `/api/upload/image`

- Upload property image
- Form-data: `file` (max 5MB, jpg/png/gif/webp)
- Returns: `{ imageUrl, fileName }`

---

## 📂 Project Structure

### Backend

```
million_backend/
├── Controllers/          # API endpoints
├── DTOs/                # Data transfer objects
├── Models/              # Domain entities
├── Repositories/        # Data access layer
├── Configuration/       # Settings
├── wwwroot/images/     # Uploaded images
└── Program.cs          # App configuration
```

### Frontend

```
million_frontend/
├── src/
│   ├── app/            # Pages
│   ├── components/     # Reusable UI components
│   ├── lib/api/        # API service layer
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript interfaces
├── public/             # Static assets
└── database/           # Database backup (for submission)
    ├── properties.json      # Properties collection export
    └── categories.json      # Categories collection export
```

---

## 💾 Database Backup & Restore

The `/database` folder contains MongoDB collection exports created with MongoDB Compass.

### Importing the Database

**Using MongoDB Compass (GUI):**

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Create database: `RealEstateDb`
4. Import `properties.json`:
   - Click "Add Data" → "Import JSON or CSV file"
   - Select `/database/properties.json`
   - Collection name: `properties`
5. Import `categories.json`:
   - Click "Add Data" → "Import JSON or CSV file"
   - Select `/database/categories.json`
   - Collection name: `categories`

**Using Command Line:**

```bash
# Navigate to database folder
cd database

# Import properties collection
mongoimport --db=RealEstateDb \
  --collection=properties \
  --file=properties.json \
  --jsonArray

# Import categories collection
mongoimport --db=RealEstateDb \
  --collection=categories \
  --file=categories.json \
  --jsonArray
```

### Verify Import

```bash
# Check collections exist
mongosh RealEstateDb --eval "show collections"

# Count documents
mongosh RealEstateDb --eval "db.properties.countDocuments()"
mongosh RealEstateDb --eval "db.categories.countDocuments()"
```

### Database Schema

**Properties Collection:**

```json
{
  "_id": "ObjectId",
  "name": "string",
  "addressProperty": "string",
  "priceProperty": "number",
  "type": "string",
  "idOwner": "string",
  "imageUrl": "string",
  "active": "boolean",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Categories Collection:**

```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string"
}
```

---

**Last Updated:** November 19, 2025
