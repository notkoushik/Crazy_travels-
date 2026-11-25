ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS destination_slug VARCHAR(120) REFERENCES destinations(slug) ON UPDATE CASCADE ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS traveller_group TEXT CHECK (traveller_group IN ('Couples', 'Families', 'Friends & bachelors'));
