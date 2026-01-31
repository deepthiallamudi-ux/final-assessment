REATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(500) NOT NULL,
    distance_km DECIMAL(10, 2) NOT NULL CHECK (distance_km > 0),
    passengers INTEGER NOT NULL CHECK (passengers > 0),
    tripCost DECIMAL(10, 2) DEFAULT 0 CHECK (tripCost >= 0),
    isCompleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trips_customer ON trips(customer_id);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_completed ON trips(isCompleted);