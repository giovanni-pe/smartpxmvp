export interface Walker {
  id: number;
  name: string;
  email: string;
  experience?: string;
  photo_url?: string;
  rating: number;
  total_reviews: number;
}

export interface WalkerListDTO {
  success: boolean;
  walkers: Walker[];
}
