// Real Estate App - Type Definitions

export interface Property {
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

export interface PropertyInput {
  name: string;
  description: string;
  addressProperty: string;
  type: string;
  priceProperty: number;
  imageUrl?: string;
  active?: boolean;
  idOwner?: string;
}

export interface PropertyFilter {
  name?: string;
  address?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  type?: string | null;
  active?: boolean | null;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
