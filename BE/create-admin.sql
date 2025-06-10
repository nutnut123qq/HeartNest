-- Script to create admin and nurse users for testing
-- Run this after the database is created and migrated

-- Create Admin User
INSERT INTO [Users] (
    [Id], 
    [FirstName], 
    [LastName], 
    [Email], 
    [PasswordHash], 
    [Role], 
    [IsEmailVerified], 
    [IsActive], 
    [CreatedAt], 
    [UpdatedAt], 
    [IsDeleted]
) VALUES (
    NEWID(),
    'Admin',
    'CareNest',
    'admin@carenest.com',
    '$2a$11$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ', -- password: admin123
    2, -- Admin role
    1, -- Email verified
    1, -- Active
    GETUTCDATE(),
    GETUTCDATE(),
    0  -- Not deleted
);

-- Create Nurse User
INSERT INTO [Users] (
    [Id], 
    [FirstName], 
    [LastName], 
    [Email], 
    [PasswordHash], 
    [Role], 
    [IsEmailVerified], 
    [IsActive], 
    [CreatedAt], 
    [UpdatedAt], 
    [IsDeleted]
) VALUES (
    NEWID(),
    'Nurse',
    'Test',
    'nurse@carenest.com',
    '$2a$11$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ', -- password: nurse123
    1, -- Nurse role
    1, -- Email verified
    1, -- Active
    GETUTCDATE(),
    GETUTCDATE(),
    0  -- Not deleted
);

-- Note: The password hashes above are placeholders
-- You need to generate real BCrypt hashes for the actual passwords
