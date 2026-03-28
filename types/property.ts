export type PropertyType = 'apartment' | 'villa' | 'penthouse' | 'estate' | 'townhouse';
export type PropertyStatus = 'for-sale' | 'for-rent';

export interface PropertyAgent {
  name: string;
  phone: string;
  email: string;
  photo: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  priceLabel: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  parking: number;
  neighborhood: string;
  city: string;
  address: string;
  coordinates: [number, number];
  description: string;
  shortDescription: string;
  images: string[];
  amenities: string[];
  agent: PropertyAgent;
  featured: boolean;
  tags: string[];
}

export interface PropertyFilters {
  type: PropertyType | 'all';
  status: PropertyStatus | 'all';
  priceMin: number;
  priceMax: number;
  bedsMin: number;
  bathsMin: number;
  sqftMin: number;
  sqftMax: number;
  amenities: string[];
}
