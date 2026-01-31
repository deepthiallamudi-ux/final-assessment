# User Model

## Table Name
`users`

## Columns

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| name | VARCHAR(255) | NOT NULL | User full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| password | VARCHAR(255) | NOT NULL | User password (stored as plain text) |
| role | VARCHAR(50) | NOT NULL, CHECK (role IN ('customer', 'owner', 'driver')) | User role |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation timestamp |

## Constraints
- Email must be unique across all users
- Role must be one of: customer, owner, driver
- All fields except id and created_at are required

## Relationships
- **One-to-Many with vehicles**: One owner can have multiple vehicles
- **One-to-Many with trips**: One customer can have multiple trips
- **One-to-One with vehicles**: One driver can be assigned to one vehicle

## Indexes
- `idx_users_email` on email column
- `idx_users_role` on role column