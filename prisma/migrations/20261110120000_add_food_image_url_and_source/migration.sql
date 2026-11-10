
-- Keep the Food source enum in sync with the actual database.
ALTER TABLE `food`
MODIFY COLUMN `source` ENUM(
  'LOCAL',
  'GENERIC',
  'OPEN_FOOD_FACTS',
  'USDA',
  'LIVSMEDELSVERKET'
) NOT NULL DEFAULT 'LOCAL';

-- Store the Vercel Blob image URL.
ALTER TABLE `food`
ADD COLUMN `imageUrl` TEXT NULL;
