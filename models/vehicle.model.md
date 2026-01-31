# Vehicle Model

## Table Name
`vehicles`

## Columns

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Vehicle name |
| registration_number | VARCHAR(100) | UNIQUE, NOT NULL | Vehicle registration number |
| allowed_passengers | INTEGER | NOT NULL, CHECK (allowed_passengers > 0) | Maximum passenger capacity |
| isAvailable | BOOLEAN | DEFAULT true | Vehicle availability status |
| driver_id | UUID | REFERENCES users(id), NULL | Assigned driver ID |
| rate_per_km | DECIMAL(10, 2) | NOT NULL, CHECK (rate_per_km > 0) | Cost per kilometer |
| owner_id | UUID | NOT NULL, REFERENCES users(id) | Vehicle owner ID |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation timestamp |

## Constraints
- Registration number must be unique
- Allowed passengers must be greater than 0
- Rate per km must be greater than 0
- Owner must exist in users table with role 'owner'
- Driver must exist in users table with role 'driver'

## Relationships
- **Many-to-One with users (owner)**: Each vehicle belongs to one owner
- **One-to-One with users (driver)**: Each vehicle can have one driver
- **One-to-Many with trips**: One vehicle can have multiple trips

## Indexes
- `idx_vehicles_owner` on owner_id column
- `idx_vehicles_driver` on driver_id column
- `idx_vehicles_available` on isAvailable column
- `idx_vehicles_registration` on registration_number column