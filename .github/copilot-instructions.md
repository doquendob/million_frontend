This is a real estate listings app built as a 1-hour PoC.
Priority: working functionality > perfect code.

Main entity: Property
Plural: Properties
Key actions: add property, list properties, view property details, filter properties
Filter by: name, address, price (min / max)

Tech stack (same)

Next.js 14+ (App Router)

TypeScript (strict)

Tailwind CSS (utility-only)

React 18+ (hooks, functional components)

lucide-react (icons)

Project structure (adapted)
/
├── app/
│   ├── page.tsx           # Main page (client component)
│   └── layout.tsx         # Root layout
├── components/
│   ├── PropertyCard.tsx
│   ├── AddPropertyForm.tsx
│   └── PropertyFilter.tsx
├── types/
│   └── index.ts           # TypeScript interfaces (Property, Filter, etc.)
├── data/
│   ├── properties.json
│   └── property-types.json   # optional: house, apartment, land...
└── ai-docs/
    └── quick-plan.md

Coding guidelines (real estate specific)
Components

Functional components only.

TypeScript for all files.

Default export: export default function ComponentName().

Props must be defined as interface.

Use 'use client' for client components.

Keep files < 150 lines where practical.

Styling

Tailwind only (no CSS files).

Mobile-first responsive design.

Use the same Tailwind patterns in the original spec (container, card, grid, button).

Example card classes (recommended):

"bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"

State management

State kept in parent (main page).

Use useState, useEffect.

Pass callbacks to children for add / filter actions.

Data handling

Load initial data from /data/properties.json.

Use static import: import properties from '../data/properties.json' (or dynamic import).

Generate ids with crypto.randomUUID() or Date.now().toString().

Keep properties in local state (no backend required for PoC).

Types (types/index.ts)

Define Property, PropertyInput, PropertyFilter, PropertyType interfaces.

Avoid any.

Example types:

export interface Property {
  id: string;
  idOwner?: string;
  name: string;
  addressProperty: string;
  priceProperty: number;
  imageUrl?: string;
  createdAt: string;
  type?: string; // optional property type
}

export interface PropertyInput {
  idOwner?: string;
  name: string;
  addressProperty: string;
  priceProperty: number;
  imageUrl?: string;
  type?: string;
}

export interface PropertyFilter {
  name?: string;
  address?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  type?: string | null;
}

File naming

Components PascalCase: PropertyCard.tsx, AddPropertyForm.tsx.

Data files lowercase: properties.json.

Types file: types/index.ts.

Component patterns (real-estate versions)
PropertyCard (entity card)

Props:

interface PropertyCardProps {
  property: Property;
  onView: (id: string) => void;
  onDelete?: (id: string) => void;
}


Behavior:

Show image (with alt).

Display name, address, formatted price.

Buttons: View details, Delete (optional).

Use lucide-react icons.

AddPropertyForm (add form)

Props:

interface AddPropertyFormProps {
  onAdd: (input: PropertyInput) => void;
  types?: { id: string; name: string }[];
}


Behavior:

Controlled inputs for name, address, price, type, imageUrl.

Basic validation (name, address, price required).

Clear form after submit.

Use crypto.randomUUID() to create id and new Date().toISOString() for createdAt in the parent before inserting into state (or return input and parent adds id).

PropertyFilter (filters)

Props:

interface PropertyFilterProps {
  filter: PropertyFilter;
  onChange: (next: PropertyFilter) => void;
  types?: { id: string; name: string }[];
}


Behavior:

Inputs for name, address, priceMin, priceMax.

Optionally, type selector (pills).

Debounce free — simple immediate updates are fine for PoC.

Provide "Clear" button.

Empty and loading states

Show helpful empty state when properties.length === 0.

Use isLoading small skeleton/animate-pulse if simulating async load.

Accessibility

Use semantic HTML, labels, alt text, accessible buttons.

Next.js App Router specifics (reminder)

All pages in /app.

Main page is a client component: 'use client' at the top.

Use @/types or relative imports.

No server-only features required.

Performance & scope tradeoffs

Do not over-optimize; prioritize a working UI within 1 hour.

No API/backend unless explicitly requested. Use local JSON + component state.

Keep list rendering simple; limit initial UI to 50 items if dataset large.

Example behaviour (expected UX)

Page loads properties from /data/properties.json into local state.

Top: AddPropertyForm to create new properties.

Left/Top or inline: PropertyFilter to filter by name, address, price range and (optionally) type.

Grid of PropertyCard components showing image, name, address, price, View button.

Clicking View opens a modal or navigates to a simple details page (optional).

Deleting removes property from state (confirm optional).

Quick plan (1-hour checklist)

 Create types/index.ts.

 Add data/properties.json with 8–12 sample items.

 Implement PropertyCard.tsx.

 Implement AddPropertyForm.tsx.

 Implement PropertyFilter.tsx.

 Implement app/page.tsx to wire everything.

 Test responsiveness and basic edge cases (empty list, invalid price).

 Final polish: icons, spacing, README.

Helpful snippets & conventions

Format price

function formatMoney(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}


Image fallback

<img src={property.imageUrl || '/placeholder.jpg'} alt={property.name} className="w-full h-40 object-cover rounded" />


Generate id

const id = typeof crypto !== 'undefined' ? crypto.randomUUID() : Date.now().toString();

Deliverable expectations

Provide complete working files for /app/page.tsx, /components/*, /types/index.ts, /data/properties.json.

Each file should include imports, full TypeScript code, prop interfaces, and Tailwind classes.

Keep components concise and readable.

Current build phase

 Planning & setup

 Data & types

 Component 1: PropertyCard

 Component 2: AddPropertyForm

 Component 3: PropertyFilter

 Main page integration

 Testing & debugging

 Polish & demo prep