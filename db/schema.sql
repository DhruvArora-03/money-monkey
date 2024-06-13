CREATE TABLE
    expense (
        id SERIAL NOT NULL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        plaid_connection_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        amount_cents INTEGER NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
    );

CREATE TABLE
    plaid_connection (
        user_id INTEGER NOT NULL,
        item_id TEXT NOT NULL,
        access_token TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
    );

CREATE TABLE
    users (
        id SERIAL NOT NULL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
    );


ALTER TABLE expense ADD CONSTRAINT expense_plaid_connection_id_foreign FOREIGN KEY (plaid_connection_id) REFERENCES plaid_connection (id);

ALTER TABLE expense ADD CONSTRAINT expense_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE plaid_connection ADD CONSTRAINT plaid_connection_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id);