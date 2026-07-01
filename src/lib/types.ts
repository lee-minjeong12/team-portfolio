export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  client_name: string;
  year: number;
  role: string;
  description: string;
  thumbnail_url: string;
  media_urls: string[]; // Additional gallery images
  video_url?: string;   // Embedded video link or direct URL
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  site_title: string;
  site_description: string;
  hero_title: string;
  hero_subtitle: string;
  contact_email: string;
  instagram_url: string;
  behance_url: string;
  updated_at: string;
}
