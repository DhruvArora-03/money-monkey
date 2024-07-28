CREATE TABLE applied_script (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE plaid_transaction (
    id SERIAL NOT NULL PRIMARY KEY,
    user_id TEXT NOT NULL,
    plaid_connection_id INTEGER NOT NULL,
    expense_id INTEGER,
    transaction_id TEXT NOT NULL,
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
    user_id TEXT NOT NULL,
    plaid_transaction_id INTEGER,
    name TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    date DATE NOT NULL,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE plaid_connection (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    item_id TEXT NOT NULL,
    cursor TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO category (name) VALUES
    ('Housing'),
    ('Groceries'),
    ('Food'),
    ('Transportation'),
    ('Entertainment'),
    ('Necessities'),
    ('Clothes'),
    ('Insurance'),
    ('Personal Care'),
    ('Medical'),
    ('Other');

CREATE TABLE user_category (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    sum_cents INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX plaid_transaction_idx_transaction_id ON plaid_transaction (transaction_id);

ALTER TABLE plaid_transaction
ADD CONSTRAINT plaid_transaction_expense_id_foreign FOREIGN KEY (expense_id) REFERENCES expense (id),
ADD CONSTRAINT plaid_transaction_plaid_connection_id_foreign FOREIGN KEY (plaid_connection_id) REFERENCES plaid_connection (id) ON DELETE CASCADE;

ALTER TABLE expense
ADD CONSTRAINT expense_plaid_transaction_id_foreign FOREIGN KEY (plaid_transaction_id) REFERENCES plaid_transaction (id) ON DELETE CASCADE;

ALTER TABLE user_category
ADD CONSTRAINT user_category_category_id_foreign FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE;

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_applied_script_updated_at
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
