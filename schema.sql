-- Users Table
CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(150) UNIQUE NOT NULL,
 password VARCHAR(255) NOT NULL,
 role VARCHAR(20) NOT NULL CHECK(role IN ('farmer','company','admin')),
 phone VARCHAR(20),
 created_at TIMESTAMP DEFAULT NOW()
);

-- Waste Listings Table
CREATE TABLE waste_listings (
 id SERIAL PRIMARY KEY,
 farmer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
 type VARCHAR(100) NOT NULL,
 quantity VARCHAR(50) NOT NULL,
 price DECIMAL(10,2) NOT NULL,
 location VARCHAR(200) NOT NULL,
 image_url TEXT,
 status VARCHAR(20) DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
 created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_waste_status ON waste_listings(status);
CREATE INDEX idx_waste_type ON waste_listings(type);
CREATE INDEX idx_waste_location ON waste_listings(location);
