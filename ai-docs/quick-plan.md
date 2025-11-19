# Real Estate Listings App - 1 Hour MVP Plan

## MVP Features (5)

1. **Add Property** - Form with name, address, price, imageUrl
2. **List Properties** - Responsive grid with property cards
3. **Filter Properties** - By name, address, price min/max
4. **View Details** - Inline expansion or modal
5. **Delete Property** - Remove from list with confirmation

## Pages

- `/` - Main listing page (client component)

## Components

- `PropertyCard` - Display property with image, name, address, price, actions
- `AddPropertyForm` - Input form for new properties
- `PropertyFilter` - Filter inputs (name, address, priceMin, priceMax)
- `Header` - App title and branding

## Data Structure (TypeScript)

```ts
Property { id, name, addressProperty, priceProperty, imageUrl?, createdAt }
PropertyInput { name, addressProperty, priceProperty, imageUrl? }
PropertyFilter { name?, address?, priceMin?, priceMax? }
```

## Build Order (8 steps)

1. **Types + sample data** (5min) - Create types/index.ts, data/properties.json
2. **Layout + Header** (5min) - Update layout.tsx, create Header component
3. **PropertyCard** (10min) - Display component with view/delete buttons
4. **AddPropertyForm** (10min) - Controlled form with validation
5. **PropertyFilter** (5min) - Filter inputs with clear button
6. **Page wiring** (15min) - State management, filter logic, CRUD operations
7. **Delete/View actions** (5min) - Implement handlers and modal/details
8. **Polish/Responsive** (5min) - Mobile layout, empty states, final styling

## Assumptions

- Local state only (no API/backend)
- Data from JSON file imported into state
- Filters apply immediately (no debounce)
- Basic validation (required fields only)
