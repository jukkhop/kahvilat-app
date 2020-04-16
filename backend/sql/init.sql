\c kahvilat_db

CREATE TABLE places(
  "id" serial,
  "external_id" VARCHAR(255) NOT NULL,
  "name" VARCHAR(255) NOT NULL
);

INSERT INTO places ("external_id", "name") VALUES ('kaffaroastery', 'Kaffa Roastery');