CREATE TABLE
    transactions (
        id SERIAL PRIMARY KEY,
        tenpista VARCHAR(200) NOT NULL,
        date TIMESTAMP NOT NULL,
        business VARCHAR(200) NOT NULL,
        amount INTEGER NOT NULL
    );