# Trip Model

## Table Name
`trips`

## Columns

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| customer_id | UUID | NOT NULL, REFERENCES users(id) | Customer who booked the trip |
| vehicle_id | UUID | NOT NULL, REFERENCES vehicles(id) | Vehicle used for the trip |
| start_date | TIMESTAMP WITH TIME ZONE | NOT NULL | Trip start date and time |
| end_date | TIMESTAMP WITH TIME ZONE | NULL | Trip end date and time |
| location | VARCHAR(500) | NOT NULL | Trip location |
| distance_km | DECIMAL(10, 2) | NOT NULL, CHECK (distance_km > 0) | Trip distance in kilometers |
| passengers | INTEGER | NOT NULL, CHECK (passengers > 0) | Number of passengers |
| tripCost | DECIMAL(10, 2) | DEFAULT 0, CHECK (tripCost >= 0) | Total trip cost |
| isCompleted | BOOLEAN | DEFAULT false | Trip completion status |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation timestamp |

## Constraints
- Customer must exist in users table with role 'customer'
- Vehicle must exist in vehicles table
- Distance must be greater than 0
- Passengers must be greater than 0
- Trip cost must be greater than or equal to 0
- Passengers cannot exceed vehicle's allowed_passengers

## Relationships
- **Many-to-One with users (customer)**: Each trip belongs to one customer
- **Many-to-One with vehicles**: Each trip uses one vehicle

## Business Rules
- When trip is created, vehicle isAvailable must become false
- When trip is ended, vehicle isAvailable must become true
- Trip cost is calculated as: distance_km * vehicle's rate_per_km
- Passengers must not exceed vehicle's allowed_passengers

## Indexes
- `idx_trips_customer` on customer_id column
- `idx_trips_vehicle` on vehicle_id column
- `idx_trips_completed` on isCompleted column