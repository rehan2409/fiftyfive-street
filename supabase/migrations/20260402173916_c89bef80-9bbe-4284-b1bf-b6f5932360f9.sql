
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read reviews" ON public.reviews FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert reviews" ON public.reviews FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public delete reviews" ON public.reviews FOR DELETE TO public USING (true);
