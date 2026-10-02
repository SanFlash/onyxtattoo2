ALTER TABLE users ADD COLUMN password_hash TEXT;
CREATE TABLE auth_sessions (
  token_hash TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires INTEGER NOT NULL,
  created TEXT NOT NULL
);
CREATE INDEX auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX auth_sessions_expires ON auth_sessions(expires);
CREATE TABLE booking_access (
  token_hash TEXT PRIMARY KEY NOT NULL,
  booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  created TEXT NOT NULL
);
CREATE INDEX booking_access_booking ON booking_access(booking_id);
