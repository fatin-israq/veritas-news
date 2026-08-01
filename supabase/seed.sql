-- Veritas News Seed Data
-- Seed Initial Active News Sources into public.sources

INSERT INTO public.sources (name, listing_url, parser_strategy, active, logo_url)
VALUES
  ('Reuters', 'https://www.reuters.com', 'reuters', true, 'https://www.reuters.com/pf/resources/images/reuters/logo-vertical-default-png.png'),
  ('BBC News', 'https://www.bbc.com/news', 'bbc', true, 'https://nav.files.bbci.co.uk/searchbox/eb86653df3ae168a27b8782a6f79ec6b/images/bbc-logo.svg'),
  ('The Guardian', 'https://www.theguardian.com/us', 'guardian', true, 'https://assets.guim.co.uk/images/guardian-logo-100.png'),
  ('NPR', 'https://www.npr.org', 'npr', true, 'https://media.npr.org/images/logo_npr.svg'),
  ('Fox News', 'https://www.foxnews.com', 'fox', true, 'https://static.foxnews.com/static/orion/styles/img/fox-news/og/fox-news-1200x630.png')
ON CONFLICT DO NOTHING;
