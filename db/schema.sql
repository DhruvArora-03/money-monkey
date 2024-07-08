CREATE TABLE applied_scripts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE plaid_transaction (
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    plaid_connection_id INTEGER NOT NULL,
    expense_id INTEGER NOT NULL,
    transaction_id TEXT,
    name TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    date DATE NOT NULL,
    category TEXT,
    merchant_name TEXT,
    personal_finance_category TEXT,
    transaction_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE expense (
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    date DATE NOT NULL,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE plaid_connection (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    access_token TEXT NOT NULL,
    item_id TEXT NOT NULL,
    cursor TEXT,
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

CREATE INDEX plaid_transaction_idx_transaction_id ON plaid_transaction (transaction_id);

ALTER TABLE plaid_transaction
ADD CONSTRAINT plaid_transaction_expense_id_foreign FOREIGN KEY (expense_id) REFERENCES expense (id),
ADD CONSTRAINT plaid_transaction_plaid_connection_id_foreign FOREIGN KEY (plaid_connection_id) REFERENCES plaid_connection (id),
ADD CONSTRAINT plaid_transaction_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE expense
ADD CONSTRAINT expense_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE plaid_connection
ADD CONSTRAINT plaid_connection_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id);

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_applied_scripts_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

CREATE TRIGGER update_plaid_transaction_updated_at
BEFORE UPDATE ON plaid_transaction
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

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

-- Function to add to expense table when adding to plaid_transaction table
CREATE OR REPLACE FUNCTION create_expense()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO expense (user_id, name, amount_cents, date, category)
    VALUES (NEW.user_id, NEW.name, NEW.amount_cents, NEW.date, NEW.category);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_expense_from_plaid_connection
AFTER INSERT ON plaid_transaction
FOR EACH ROW
EXECUTE FUNCTION create_expense();
