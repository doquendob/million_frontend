# API Integration Guide for .NET Backend

This document outlines the API endpoints that the Next.js frontend expects from the .NET backend.

## Implementation Status

✅ **All endpoints implemented and tested**  
✅ **NUnit test suite passing**  
✅ **Server-side filtering working**  
✅ **Image upload functional**

See [TESTING.md](/Users/doquendob/Documents/million_backend/TESTING.md) for test details.

## Base URL

The frontend is configured to use the API URL from environment variables:

- Development: `http://localhost:5000/api`
- Production: Set via `NEXT_PUBLIC_API_URL` environment variable

## Required Endpoints

### Properties

#### 1. Get All Properties (with optional filters)

```
GET /api/properties?name={name}&address={address}&priceMin={min}&priceMax={max}&type={type}&active={true|false}
```

**Query Parameters** (all optional):

- `name` (string): Filter by property name (case-insensitive, partial match)
- `address` (string): Filter by address (case-insensitive, partial match)
- `priceMin` (number): Minimum price filter
- `priceMax` (number): Maximum price filter
- `type` (string): Filter by property type (exact match)
- `active` (boolean): Filter by active status

**Example**:

```
GET /api/properties?name=villa&priceMin=100000&priceMax=500000&type=House&active=true
```

**Response**: Array of Property objects

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "addressProperty": "string",
    "type": "string",
    "priceProperty": 0,
    "imageUrl": "string (optional)",
    "active": true,
    "createdAt": "2025-11-18T10:30:00Z",
    "idOwner": "string (optional)"
  }
]
```

Alternative response format (also supported):

```json
{
  "data": [...properties],
  "success": true,
  "message": "Success"
}
```

#### 2. Get Property by ID

```
GET /api/properties/{id}
```

**Response**: Single Property object

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "addressProperty": "string",
  "type": "string",
  "priceProperty": 0,
  "imageUrl": "string (optional)",
  "active": true,
  "createdAt": "2025-11-18T10:30:00Z",
  "idOwner": "string (optional)"
}
```

#### 3. Create Property

```
POST /api/properties
```

**Request Body**:

```json
{
  "name": "string",
  "description": "string",
  "addressProperty": "string",
  "type": "string",
  "priceProperty": 0,
  "imageUrl": "string (optional)",
  "active": true,
  "idOwner": "string (optional)"
}
```

**Response**: Created Property object (including generated id and createdAt)

```json
{
  "id": "generated-uuid",
  "name": "string",
  "description": "string",
  "addressProperty": "string",
  "type": "string",
  "priceProperty": 0,
  "imageUrl": "string",
  "active": true,
  "createdAt": "2025-11-18T10:30:00Z",
  "idOwner": "string"
}
```

Status Code: `201 Created`

#### 4. Update Property

```
PUT /api/properties/{id}
```

**Request Body**: Same as Create (partial updates supported)

```json
{
  "name": "string",
  "description": "string",
  "addressProperty": "string",
  "type": "string",
  "priceProperty": 0,
  "imageUrl": "string",
  "active": true,
  "idOwner": "string"
}
```

**Response**: Updated Property object

Status Code: `200 OK`

#### 5. Delete Property

```
DELETE /api/properties/{id}
```

**Response**: Empty or success message

Status Code: `204 No Content` or `200 OK`

### Categories

#### 1. Get All Categories

```
GET /api/categories
```

**Response**: Array of Category objects

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string (optional)"
  }
]
```

### Upload

#### 1. Upload Image

```
POST /api/upload/image
```

**Content-Type**: `multipart/form-data`

**Request Body**:

- `file`: Image file (jpg, jpeg, png, gif, webp)
- Maximum file size: 5MB

**Response**:

```json
{
  "imageUrl": "/images/properties/filename.jpg",
  "fileName": "guid-filename.jpg"
}
```

**Error Response** (400):

```json
{
  "message": "Invalid file type. Only images are allowed (jpg, jpeg, png, gif, webp)"
}
```

or

```json
{
  "message": "File size exceeds 5MB limit"
}
```

#### 2. Delete Image

```
DELETE /api/upload/image?fileName={fileName}
```

**Query Parameters**:

- `fileName` (string): The file name to delete

**Response** (200):

```json
{
  "message": "Image deleted successfully"
}
```

**Error Response** (404):

```json
{
  "message": "File not found"
}
```

## Backend Requirements

### Static Files

The backend must serve static files from `wwwroot/images/properties/`:

**Program.cs**:

```csharp
app.UseStaticFiles();
```

### Categories

#### 1. Get All Categories

```
GET /api/categories
```

**Response**: Array of Category objects

```json
[
  {
    "id": "string",
    "name": "string",
    "color": "string (hex color)"
  }
]
```

Example:

```json
[
  { "id": "cat-001", "name": "House", "color": "#10b981" },
  { "id": "cat-002", "name": "Apartment", "color": "#3b82f6" },
  { "id": "cat-003", "name": "Villa", "color": "#f59e0b" },
  { "id": "cat-004", "name": "Townhouse", "color": "#8b5cf6" },
  { "id": "cat-005", "name": "Estate", "color": "#ec4899" }
]
```

## Error Responses

All error responses should follow this format:

```json
{
  "message": "Error description",
  "errors": {
    "fieldName": ["Error message 1", "Error message 2"]
  }
}
```

Status Codes:

- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## CORS Configuration

The .NET backend must enable CORS for the frontend origin.

### Example .NET 6+ Configuration

**Program.cs**:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://your-production-domain.com")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// Use CORS
app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();

app.Run();
```

## Sample .NET Controller

```csharp
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Property>>> GetProperties()
    {
        // Return list of properties
        return Ok(properties);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Property>> GetProperty(string id)
    {
        var property = await _service.GetByIdAsync(id);
        if (property == null)
            return NotFound();

        return Ok(property);
    }

    [HttpPost]
    public async Task<ActionResult<Property>> CreateProperty([FromBody] PropertyInput input)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var property = await _service.CreateAsync(input);
        return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Property>> UpdateProperty(string id, [FromBody] PropertyInput input)
    {
        var property = await _service.UpdateAsync(id, input);
        if (property == null)
            return NotFound();

        return Ok(property);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProperty(string id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
}
```

## Testing the API

You can test the API endpoints using:

1. **Postman** or **Insomnia**
2. **curl** commands
3. **Swagger/OpenAPI** (recommended to add to your .NET project)

### Example curl Commands

```bash
# Get all properties
curl http://localhost:5000/api/properties

# Get property by ID
curl http://localhost:5000/api/properties/{id}

# Create property
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Property",
    "description": "A test property",
    "addressProperty": "123 Test St",
    "type": "House",
    "priceProperty": 500000,
    "active": true
  }'

# Delete property
curl -X DELETE http://localhost:5000/api/properties/{id}
```

## Database Models (Example)

```csharp
public class Property
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string AddressProperty { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal PriceProperty { get; set; }
    public string? ImageUrl { get; set; }
    public bool Active { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? IdOwner { get; set; }
}

public class Category
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}
```

## Next Steps

1. Implement the .NET controllers and services
2. Set up your database (SQL Server, PostgreSQL, etc.)
3. Configure Entity Framework or your preferred ORM
4. Add validation and business logic
5. Test all endpoints
6. Start the frontend with the backend running
