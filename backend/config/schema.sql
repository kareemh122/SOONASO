CREATE DATABASE Drilling;
USE Drilling;

CREATE TABLE owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    company VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- hashed
    role ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100),
    category VARCHAR(50), 
    image_url VARCHAR(255),

    body_weight_kg FLOAT,
    operating_weight_kg FLOAT, 
    overall_length_mm FLOAT,
    overall_width_mm FLOAT,
    overall_height_mm FLOAT,
    required_oil_flow_lpm FLOAT,
    operating_pressure_bar FLOAT,
    impact_rate_std FLOAT,
    impact_rate_soft_rock FLOAT,
    hose_diameter_mm FLOAT,
    rod_diameter_mm FLOAT,
    applicable_carrier_si VARCHAR(100),
     owner_id INT,
    purchase_date DATE,
    warranty_start DATE,
    warranty_end DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owners(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    action TEXT NOT NULL,             -- Description of action (e.g. "Added new product")
    target TEXT,                      -- e.g., "product:123" or "owner:22"
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);