CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor') DEFAULT 'doctor',
  createdAt DATETIME,
  updatedAt DATETIME
);

CREATE TABLE Schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctorId INT,
  date DATETIME NOT NULL,
  description TEXT NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (doctorId) REFERENCES Users(id)
);

CREATE TABLE PatientCards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctorId INT,
  patientName VARCHAR(255) NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT,
  notes TEXT,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (doctorId) REFERENCES Users(id)
);


INSERT INTO Users (email, password, role, createdAt, updatedAt) 
VALUES (
  'admin@hospital.com',
  '$2a$12$bX02EQ10oGH3UxPShaOlYuFTSfOrBmgvRHibYzMEjJQtNtoTgy7OS', 
  'admin', 
  NOW(), 
  NOW()
);
