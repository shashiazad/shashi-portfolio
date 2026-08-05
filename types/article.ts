export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featured_image?: string | null;
  content_html: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
