CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    allowed_passengers INTEGER NOT NULL CHECK (allowed_passengers > 0),
    isAvailable BOOLEAN DEFAULT true,
    driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    rate_per_km DECIMAL(10, 2) NOT NULL CHECK (rate_per_km > 0),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_driver ON vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_available ON vehicles(isAvailable);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration_number);