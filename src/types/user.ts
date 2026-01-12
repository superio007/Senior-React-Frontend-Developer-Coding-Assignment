/**
 * Geographic location coordinates
 */
export interface GeoLocation {
  lat: string;
  lng: string;
}

/**
 * User address information
 */
export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: GeoLocation;
}

/**
 * User company information
 */
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

/**
 * User data from JSONPlaceholder API
 */
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

/**
 * Sort direction for user list
 */
export type SortDirection = "asc" | "desc";
