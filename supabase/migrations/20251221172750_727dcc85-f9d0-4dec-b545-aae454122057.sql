-- First, update the category check constraint to include more categories
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE public.products ADD CONSTRAINT products_category_check 
  CHECK (category = ANY (ARRAY['Cargos'::text, 'Jackets'::text, 'T-Shirts'::text, 'Jeans'::text, 'Hoodies'::text, 'Accessories'::text]));

-- Insert demo products for Fifty-Five streetwear brand
INSERT INTO public.products (name, category, price, description, sizes, images) VALUES
-- T-Shirts
('Classic Black Tee', 'T-Shirts', 899, 'Premium cotton black t-shirt with minimalist design. Perfect for layering or wearing solo.', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500']),
('Vintage White Tee', 'T-Shirts', 849, 'Soft vintage-wash white t-shirt with relaxed fit. Timeless streetwear essential.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1622445275576-721325763afe?w=500']),
('Graphic Print Tee', 'T-Shirts', 1099, 'Bold graphic print t-shirt featuring urban art design. Statement piece for any outfit.', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500']),
('Navy Essential Tee', 'T-Shirts', 799, 'Navy blue essential t-shirt in breathable cotton. Versatile color for any combination.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500']),
('Oversized Grey Tee', 'T-Shirts', 999, 'Trendy oversized grey t-shirt. Drop shoulder design for that effortless street style.', ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500']),

-- Cargos
('Black Tactical Cargo', 'Cargos', 2499, 'Multi-pocket black cargo pants with tactical styling. Durable ripstop fabric.', ARRAY['28', '30', '32', '34', '36'], ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500']),
('Olive Street Cargo', 'Cargos', 2299, 'Classic olive green cargo pants with adjustable ankle cuffs. Military-inspired design.', ARRAY['28', '30', '32', '34', '36'], ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500']),
('Beige Utility Cargo', 'Cargos', 2199, 'Beige utility cargo with oversized pockets. Relaxed fit for maximum comfort.', ARRAY['28', '30', '32', '34'], ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500']),
('Grey Jogger Cargo', 'Cargos', 1999, 'Hybrid jogger-cargo in grey with elastic waistband. Street meets comfort.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500']),

-- Jackets
('Black Bomber Jacket', 'Jackets', 3999, 'Classic black bomber jacket with ribbed cuffs and hem. Timeless streetwear icon.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500']),
('Denim Trucker Jacket', 'Jackets', 3499, 'Medium wash denim jacket with classic trucker silhouette. Layer it over anything.', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500']),
('Olive Utility Jacket', 'Jackets', 4299, 'Olive green utility jacket with multiple pockets. Rugged yet stylish.', ARRAY['M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500']),
('Black Hoodie Jacket', 'Jackets', 2999, 'Zip-up hoodie jacket in black with kangaroo pocket. Cozy streetwear staple.', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500']),
('Windbreaker Navy', 'Jackets', 2799, 'Lightweight navy windbreaker with hood. Water-resistant for unpredictable weather.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1544923246-77307dd628b3?w=500']),

-- Jeans (using new category)
('Black Slim Jeans', 'Jeans', 2299, 'Slim fit black jeans with stretch denim. Clean and versatile.', ARRAY['28', '30', '32', '34', '36'], ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500']),
('Blue Straight Jeans', 'Jeans', 2199, 'Classic blue straight-leg jeans. Medium wash with subtle distressing.', ARRAY['28', '30', '32', '34', '36'], ARRAY['https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500']),
('Light Wash Wide Jeans', 'Jeans', 2499, 'Trendy wide-leg jeans in light wash. Relaxed 90s-inspired silhouette.', ARRAY['28', '30', '32', '34'], ARRAY['https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500'])

ON CONFLICT DO NOTHING;