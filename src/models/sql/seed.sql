
-- Database seed file for used car dealership application
-- This file creates tables and inserts all initial data

BEGIN;

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS vehicle_images CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;


--Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer', -- customer | employee | owner
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    mileage INT NOT NULL,
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vehicle_images table
CREATE TABLE IF NOT EXISTS vehicle_images (
    image_id SERIAL PRIMARY KEY,
    vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Create service_requests table
CREATE TABLE IF NOT EXISTS service_requests (
    request_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted', -- submitted | in_progress | completed
    description TEXT NOT NULL,
    internal_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    message_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Insert users
INSERT INTO users (first_name, last_name, email, password_hash, role)
VALUES
  ('John', 'Driver', 'john.driver@example.com', '$2b$10$abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef', 'customer'),
  ('Sarah', 'Wheeler', 'sarah.wheeler@example.com', '$2b$10$12345123451234512345123451234512345123451234512345', 'customer'),
  ('Mike', 'Shift', 'mike.shift@example.com', '$2b$10$qwertyqwertyqwertyqwertyqwertyqwertyqwertyqwerty', 'employee'),
  ('Linda', 'Torque', 'linda.torque@example.com', '$2b$10$zxcvbzxcvbzxcvbzxcvbzxcvbzxcvbzxcvbzxcvbzxcvb', 'employee'),
  ('Carla', 'Keys', 'carla.keys@example.com', '$2b$10$98765987659876598765987659876598765987659876598765', 'customer'),
  ('Alex', 'Roadman', 'alex.roadman@example.com', '$2b$10$aa11bb22cc33dd44ee55ff66gg77hh88ii99jj00kk11ll22mm', 'customer'),
  ('Brianna', 'Clutch', 'brianna.clutch@example.com', '$2b$10$mm22nn33oo44pp55qq66rr77ss88tt99uu00vv11ww22xx33yy', 'customer'),
  ('Trevor', 'Gearson', 'trevor.gearson@example.com', '$2b$10$zz11yy22xx33ww44vv55uu66tt77ss88rr99qq00pp11oo22nn', 'employee'),
  ('Megan', 'Axle', 'megan.axle@example.com', '$2b$10$ff44ee55dd66cc77bb88aa99zz00yy11xx22ww33vv44uu55tt', 'customer'),
  ('Admin', 'Master', 'admin@example.com', '$2b$10$adminadminadminadminadminadminadminadminadminadmi', 'owner')
  ON CONFLICT (email) DO NOTHING;


-- Insert categories
INSERT INTO categories (name, slug, description)
VALUES
  ('Sedan', 'sedan', 'Comfortable four‑door passenger cars'),
  ('SUV', 'suv', 'Sport utility vehicles with extra space and capability'),
  ('Truck', 'truck', 'Pickup trucks for hauling and towing'),
  ('Coupe', 'coupe', 'Two‑door sporty vehicles'),
  ('Convertible', 'convertible', 'Cars with retractable roofs'),
  ('Minivan', 'minivan', 'Family‑oriented vans with seating for 7–8'),
  ('Electric', 'electric', 'Fully electric vehicles with zero emissions'),
  ('Hybrid', 'hybrid', 'Fuel‑efficient hybrid gasoline/electric vehicles')
ON CONFLICT (name) DO NOTHING;



-- Insert vehicles
INSERT INTO vehicles (category_id, make, model, year, slug, price, mileage, description)
VALUES
  (1, 'Toyota', 'Corolla', 2004, 'toyota-corolla-2004', 2999.00, 187000, 'Makes a mysterious whistling noise at 45 mph. Still runs. Probably.'),
  (2, 'Jeep', 'Wrangler', 1999, 'jeep-wrangler-1999', 4999.00, 210000, 'Roof leaks only when it rains. Which is unfortunate.'),
  (3, 'Ford', 'F‑150', 2001, 'ford-f150-2001', 3500.00, 240000, 'Starts every time if you talk nicely to it.'),
  (4, 'Dodge', 'Charger', 2010, 'dodge-charger-2010', 8999.00, 160000, 'Has “character.” Lots of it.'),
  (5, 'BMW', 'Z4', 2005, 'bmw-z4-2005', 6999.00, 155000, 'Convertible top works… when it feels like it.'),
  (6, 'Chrysler', 'Town & Country', 2008, 'chrysler-town-and-country-2008', 2500.00, 198000, 'Smells faintly like crayons. No one knows why.'),
  (7, 'Nissan', 'Leaf', 2013, 'nissan-leaf-2013', 4999.00, 82000, 'Battery range: “Yes.”'),
  (8, 'Toyota', 'Prius', 2007, 'toyota-prius-2007', 3200.00, 220000, 'Hybrid system occasionally screams like a banshee. Still efficient.');



-- Insert vehicle images
INSERT INTO vehicle_images (vehicle_id, image_url, alt_text)
VALUES
  (1, 'https://via.placeholder.com/800x600?text=Toyota+Corolla+2004', '2004 Toyota Corolla'),
  (2, 'https://via.placeholder.com/800x600?text=Jeep+Wrangler+1999', '1999 Jeep Wrangler'),
  (3, 'https://via.placeholder.com/800x600?text=Ford+F150+2001', '2001 Ford F-150'),
  (4, 'https://via.placeholder.com/800x600?text=Dodge+Charger+2010', '2010 Dodge Charger'),
  (5, 'https://via.placeholder.com/800x600?text=BMW+Z4+2005', '2005 BMW Z4'),
  (6, 'https://via.placeholder.com/800x600?text=Chrysler+Town+and+Country+2008', '2008 Chrysler Town & Country'),
  (7, 'https://via.placeholder.com/800x600?text=Nissan+Leaf+2013', '2013 Nissan Leaf'),
  (8, 'https://via.placeholder.com/800x600?text=Toyota+Prius+2007', '2007 Toyota Prius');


-- Insert reviews
INSERT INTO reviews (user_id, vehicle_id, rating, comment)
VALUES
  (1, 1, 4, 'Surprisingly reliable for a 2004 Corolla. The whistling at 45 mph is now part of its charm.'),
  (2, 2, 3, 'Wrangler is fun but the roof leak turned my commute into a water park.'),
  (5, 3, 5, 'F-150 starts every time as long as I compliment it first. Great truck.'),
  (1, 4, 2, 'The Charger definitely has “character.” Not sure that’s a good thing.'),
  (2, 5, 4, 'Z4 is a blast. Convertible top works about 70% of the time, which is honestly better than expected.'),
  (3, 6, 3, 'Minivan runs fine but the crayon smell haunts my dreams.'),
  (4, 7, 4, 'Leaf has “battery range: yes.” Surprisingly accurate description.'),
  (2, 8, 5, 'Prius screams sometimes but so do I. Perfect match.');


-- Insert service requests
INSERT INTO service_requests (user_id, vehicle_id, status, description, internal_notes)
VALUES
  (1, 1, 'submitted', 'Whistling noise at 45 mph is getting louder.', 'Mechanic suspects loose trim or a ghost.'),
  (2, 2, 'in_progress', 'Water leaking into cabin during rain.', 'Roof seal ordered; customer advised to avoid storms.'),
  (3, 3, 'completed', 'Truck refuses to start unless spoken to nicely.', 'Performed tune-up; truck still prefers compliments.'),
  (4, 4, 'submitted', 'Charger shakes when accelerating.', 'Likely engine mount; awaiting parts.'),
  (1, 5, 'in_progress', 'Convertible top stuck halfway again.', 'Top motor is tired of this job.'),
  (2, 6, 'completed', 'Minivan smells like crayons.', 'Deep clean performed; smell persists. Possibly permanent.'),
  (3, 7, 'submitted', 'Battery range dropped to “maybe.”', 'Running diagnostics; Leaf is being dramatic.'),
  (5, 8, 'submitted', 'Prius screams occasionally.', 'Hybrid system making banshee noises; investigating.');


-- Insert contact messages
INSERT INTO contact_messages (user_id, name, email, subject, message)
VALUES
  (1, 'John Driver', 'john.driver@example.com', 'Whistling Corolla Question', 'Hi, the Corolla started whistling at 40 mph instead of 45 mph today. Is that an improvement or a warning?'),
  (2, 'Sarah Wheeler', 'sarah.wheeler@example.com', 'Wrangler Roof Leak', 'Hello, the roof leak has expanded its territory. Do you offer rainproofing or should I invest in a poncho?'),
  (NULL, 'Tim Random', 'tim.random@example.com', 'Interested in the Prius', 'Saw the 2007 Prius listing. Does it scream loudly or just occasionally? Asking for a friend.'),
  (3, 'Mike Shift', 'mike.shift@example.com', 'Truck Compliments', 'My F-150 refuses to start unless I compliment it. Is this covered under warranty or emotional support services?'),
  (4, 'Linda Torque', 'linda.torque@example.com', 'Charger Vibration', 'The Charger shakes when accelerating. Is this normal “character” or should I bring it in?'),
  (NULL, 'Becky Curious', 'becky.curious@example.com', 'Crayon Smell Concern', 'I test drove the Town & Country and it smelled like crayons. Is that a feature or a mystery?'),
  (5, 'Carla Keys', 'carla.keys@example.com', 'Website Feedback', 'Love the new dealership site. One suggestion: add a “Does this car scream?” filter. Very useful.');







COMMIT;