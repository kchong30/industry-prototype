DROP TABLE IF EXISTS segments;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS people;

CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  amount NUMERIC NOT NULL,
  people_id INTEGER REFERENCES people(id) ON DELETE CASCADE
);

CREATE TABLE segments (
  id SERIAL PRIMARY KEY,
  segment_name TEXT NOT NULL,
  people_ids TEXT[] NOT NULL
);

--Dummy Data for People Table

INSERT INTO people (name, email)
VALUES ('Michael Johnson', 'michaelj@example.com'),
       ('Sarah Brown', 'sarahb@example.com'),
       ('David Lee', 'davidl@example.com'),
       ('Emily Chen', 'emilyc@example.com'),
       ('Jason Kim', 'jasonk@example.com'),
       ('Karen Miller', 'karenm@example.com'),
       ('Oliver Jones', 'oliverj@example.com'),
       ('Linda Smith', 'lindas@example.com'),
       ('Juan Perez', 'juanp@example.com'),
       ('Alicia Rodriguez', 'aliciar@example.com');

--Dummy data for transactions

INSERT INTO transactions (amount, people_id)
VALUES (100.00, 1),
       (200.00, 1),
       (50.00, 1),
       (150.00, 2),
       (75.00, 2),
       (300.00, 3),
       (500.00, 4),
       (250.00, 5),
       (125.00, 6),
       (150.00, 7);

--Dummy data for segments

INSERT INTO segments (segment_name, people_ids)
VALUES ('Segment A', ARRAY[1, 2, 3]),
       ('Segment B', ARRAY[4, 5]),
       ('Segment C', ARRAY[1, 6]),
       ('Segment D', ARRAY[7]),
       ('Segment E', ARRAY[3, 5, 9]),
       ('Segment F', ARRAY[2, 4, 6, 8]),
       ('Segment G', ARRAY[10]),
       ('Segment H', ARRAY[1, 4, 8]),
       ('Segment I', ARRAY[2, 3, 5, 7]),
       ('Segment J', ARRAY[1, 6, 9, 10]);