-- Seed a dummy article for testing the public article pages.
-- Run this in the Supabase SQL editor for your project.

insert into public.articles (
  title,
  slug,
  summary,
  featured_image,
  content_html,
  is_published,
  published_at
) values (
  'Getting Started with the Portfolio Engine',
  'getting-started-with-the-portfolio-engine',
  'A quick test article describing how the portfolio backend and article pages are wired together.',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
  '<h2>Welcome to the test article</h2><p>This dummy article verifies the public articles page and article detail page display correctly.</p><p>Use the admin portal to edit or create real articles.</p>',
  true,
  now()
);
