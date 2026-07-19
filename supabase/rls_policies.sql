-- Supabase Row Level Security (RLS) Policies
-- This SQL script enables Row Level Security (RLS) on all tables and defines policies to secure sensitive data.
-- You can execute this script in the Supabase SQL Editor to enforce RLS on your production database.

--------------------------------------------------
-- 1. Enable RLS on all tables
--------------------------------------------------
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Offer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Banner" ENABLE ROW LEVEL SECURITY;

--------------------------------------------------
-- 2. User Table Policies
--------------------------------------------------
-- Enable users to read and update only their own profile
CREATE POLICY "Users can view their own profile" ON "User"
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON "User"
  FOR UPDATE USING (auth.uid()::text = id);

-- Admins have full access
CREATE POLICY "Admins have full access on User table" ON "User"
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id = auth.uid()::text AND "User".role = 'ADMIN'
    )
  );

--------------------------------------------------
-- 3. Category Table Policies (Public Read, Admin Write)
--------------------------------------------------
CREATE POLICY "Anyone can view categories" ON "Category"
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON "Category"
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id = auth.uid()::text AND "User".role = 'ADMIN'
    )
  );

--------------------------------------------------
-- 4. Product Table Policies (Public Read, Admin Write)
--------------------------------------------------
CREATE POLICY "Anyone can view products" ON "Product"
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON "Product"
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id = auth.uid()::text AND "User".role = 'ADMIN'
    )
  );

--------------------------------------------------
-- 5. ProductVariant Table Policies (Public Read, Admin Write)
--------------------------------------------------
CREATE POLICY "Anyone can view variants" ON "ProductVariant"
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage variants" ON "ProductVariant"
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id = auth.uid()::text AND "User".role = 'ADMIN'
    )
  );

--------------------------------------------------
-- 6. Order Table Policies (User read own, Admin full access)
--------------------------------------------------
CREATE POLICY "Users can view their own orders" ON "Order"
  FOR SELECT USING (auth.uid()::text = "userId");

-- Note: Customers can insert orders, but only via validated backend actions
-- These policies secure direct Supabase Client access
CREATE POLICY "Users can insert their own orders" ON "Order"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Admins can manage orders" ON "Order"
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id = auth.uid()::text AND "User".role = 'ADMIN'
    )
  );

--------------------------------------------------
-- 7. OrderItem Table Policies (User read own, Admin full access)
--------------------------------------------------
CREATE POLICY "Users can view their own order items" ON "OrderItem"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "Order"
      WHERE "Order".id = "orderId" AND "Order"."userId" = auth.uid()::text
    )
  );

CREATE POLICY "Admins can manage order items" ON "OrderItem"
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id = auth.uid()::text AND "User".role = 'ADMIN'
    )
  );

--------------------------------------------------
-- 8. Offer Table Policies (Public Read, Admin Write)
--------------------------------------------------
CREATE POLICY "Anyone can view offers" ON "Offer"
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage offers" ON "Offer"
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id = auth.uid()::text AND "User".role = 'ADMIN'
    )
  );

--------------------------------------------------
-- 9. Banner Table Policies (Public Read active, Admin Write)
--------------------------------------------------
CREATE POLICY "Anyone can view active banners" ON "Banner"
  FOR SELECT USING ("isActive" = true);

CREATE POLICY "Admins can manage banners" ON "Banner"
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM "User" 
      WHERE "User".id = auth.uid()::text AND "User".role = 'ADMIN'
    )
  );
