export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Gate {
  id: string;
  name: string;
  lat: number;
  lng: number;
  closestSections: string[];
}

export interface Amenity {
  id: string;
  type: 'food' | 'restroom' | 'medical';
  name: string;
  lat: number;
  lng: number;
  wait_time_mins: number;
}

export interface Stadium {
  id: string;
  name: string;
  location: Coordinates;
  zoom: number;
  gates: Gate[];
  amenities: Amenity[];
}

export interface StadiumData {
  stadiums: Stadium[];
}
