CREATE TABLE reference (
  id SERIAL      PRIMARY KEY,
  spaceName      TEXT,
  problemHash    CHAR(46) NOT NULL,
  solutionHash   CHAR(46)
);
