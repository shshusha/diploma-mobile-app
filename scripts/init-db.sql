-- Create tables and seed data
INSERT INTO users (id, email, name, phone) VALUES 
('user1', 'john.doe@example.com', 'John Doe', '+1234567890'),
('user2', 'jane.smith@example.com', 'Jane Smith', '+1987654321');

INSERT INTO alerts (id, userId, type, severity, message, latitude, longitude, isResolved) VALUES
('alert1', 'user1', 'FALL_DETECTED', 'HIGH', 'Fall detected at Central Park', 40.7829, -73.9654, false),
('alert2', 'user1', 'IMMOBILITY_DETECTED', 'MEDIUM', 'No movement detected for 10 minutes', 40.7580, -73.9855, true),
('alert3', 'user2', 'ROUTE_DEVIATION', 'LOW', 'User deviated from planned route', 40.7614, -73.9776, false);

INSERT INTO locations (id, userId, latitude, longitude, accuracy, speed) VALUES
('loc1', 'user1', 40.7829, -73.9654, 5.0, 0.0),
('loc2', 'user1', 40.7580, -73.9855, 3.2, 1.5),
('loc3', 'user2', 40.7614, -73.9776, 4.1, 2.1);

INSERT INTO emergency_contacts (id, userId, name, phone, email, relation) VALUES
('contact1', 'user1', 'Sarah Doe', '+1234567891', 'sarah@example.com', 'Spouse'),
('contact2', 'user1', 'Emergency Services', '911', null, 'Emergency'),
('contact3', 'user2', 'Mike Smith', '+1987654322', 'mike@example.com', 'Brother');

INSERT INTO detection_rules (id, userId, fallSensitivity, immobilityTimeout, isActive) VALUES
('rule1', 'user1', 0.8, 300, true),
('rule2', 'user2', 0.7, 600, true);
