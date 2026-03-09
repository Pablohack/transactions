CREATE TABLE
    transactions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        date_transaction TIMESTAMP NOT NULL,
        comercio VARCHAR(200) NOT NULL,
        monto INTEGER NOT NULL
    );