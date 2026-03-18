-- ==============================================================================
-- GLOBAL SMART TRAVEL & VEHICLE ANALYZER SQL SCHEMA
-- Run these commands in your Supabase SQL Editor to create the necessary tables.
-- ==============================================================================

-- 1. Create Vehicles Database
CREATE TABLE vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- e.g. "Toyota RAV4"
    brand VARCHAR(100) NOT NULL, -- e.g. "Toyota"
    type VARCHAR(50) NOT NULL, -- e.g. "SUV", "Car", "Bike", "Truck"
    fuel_efficiency_km_l DECIMAL(5,2) NOT NULL, -- e.g. 15.5
    engine_capacity_cc INT NOT NULL, -- e.g. 2500
    recommended_speed_kmh INT DEFAULT 80, -- e.g. 80
    heat_tolerance_level VARCHAR(50) DEFAULT 'Normal', -- e.g. Normal, High
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed some initial global vehicles
INSERT INTO vehicles (name, brand, type, fuel_efficiency_km_l, engine_capacity_cc) VALUES
('Corolla', 'Toyota', 'Car', 18.0, 1800),
('RAV4', 'Toyota', 'SUV', 14.5, 2500),
('F-150', 'Ford', 'Truck', 8.5, 3500),
('Ninja 400', 'Kawasaki', 'Bike', 25.0, 400),
('Model 3', 'Tesla', 'EV', 99.9, 0), -- 99.9 used as proxy for negligible fuel loss
('Prius', 'Toyota', 'Hybrid', 24.0, 1800);

-- 2. Create Fuel Prices Database (By Country)
CREATE TABLE fuel_prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL UNIQUE, -- e.g. "France"
    country_code VARCHAR(3), -- e.g. "FR"
    currency VARCHAR(10), -- e.g. "EUR", "USD", "INR"
    price_per_liter DECIMAL(10,3) NOT NULL, -- e.g. 1.85
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed some initial global fuel prices (Example values)
INSERT INTO fuel_prices (country_name, country_code, currency, price_per_liter) VALUES
('France', 'FR', 'EUR', 1.85),
('United States', 'US', 'USD', 0.95), -- Rough avg converted to per-liter
('India', 'IN', 'INR', 100.00),
('Japan', 'JP', 'JPY', 170.00),
('United Kingdom', 'GB', 'GBP', 1.45),
('United Arab Emirates', 'AE', 'AED', 3.00);

-- 3. Create Trips History Database
CREATE TABLE trips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Links directly to Supabase Auth user
    departure_location VARCHAR(255) NOT NULL,
    destination_location VARCHAR(255) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id),
    distance_km DECIMAL(10,2) NOT NULL,
    travel_time_hours DECIMAL(5,2) NOT NULL,
    total_fuel_cost DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    scheduled_date DATE,
    scheduled_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Row Level Security (RLS) is disabled by default. 
-- For production, you should enable RLS on the `trips` table so users can only see their own trips:
-- ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can insert their own trips" ON trips FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can view their own trips" ON trips FOR SELECT USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. Create Storage Bucket for Trip Artifacts
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('trip-reports', 'trip-reports', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'trip-reports');
-- Policy to allow authenticated users to upload files
CREATE POLICY "Auth Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'trip-reports' AND auth.role() = 'authenticated');
