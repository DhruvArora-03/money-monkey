-- Create tables with default current timestamps for created_at and updated_at
CREATE TABLE expense (
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    plaid_connection_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE plaid_connection (
    id SERIAL PRIMARY KEY, -- Added a primary key
    user_id INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE expense ADD CONSTRAINT expense_plaid_connection_id_foreign FOREIGN KEY (plaid_connection_id) REFERENCES plaid_connection (id);
ALTER TABLE expense ADD CONSTRAINT expense_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE plaid_connection ADD CONSTRAINT plaid_connection_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id);

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for update columns
CREATE TRIGGER update_expense_updated_at
BEFORE UPDATE ON expense
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plaid_connection_updated_at
BEFORE UPDATE ON plaid_connection
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
