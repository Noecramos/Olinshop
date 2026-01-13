-- Add subcategory column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Add comment
COMMENT ON COLUMN categories.subcategory IS 'Optional subcategory (e.g., Jovem, Adulto, Infantil, Feminino, Masculino)';
