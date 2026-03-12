-- Tabla de transacciones con campos de auditoría y tipos de datos optimizados
CREATE TABLE
    transactions (
        id BIGSERIAL PRIMARY KEY,
        amount NUMERIC(19, 2) NOT NULL,
        business VARCHAR(120) NOT NULL,
        tenpista VARCHAR(120) NOT NULL,
        date TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

-- Índice para mejorar búsquedas por fecha
CREATE INDEX idx_transactions_date ON transactions (date DESC);

-- Índice para mejorar búsquedas por business
CREATE INDEX idx_transactions_business ON transactions (business);

-- Comentarios de documentación
COMMENT ON TABLE transactions IS 'Tabla de transacciones financieras con auditoría completa';

COMMENT ON COLUMN transactions.id IS 'Identificador único de la transacción';

COMMENT ON COLUMN transactions.amount IS 'Monto de la transacción (precisión de 2 decimales)';

COMMENT ON COLUMN transactions.business IS 'Giro o comercio (máximo 120 caracteres)';

COMMENT ON COLUMN transactions.tenpista IS 'Nombre del Tenpista (máximo 120 caracteres)';

COMMENT ON COLUMN transactions.date IS 'Fecha y hora de la transacción';

COMMENT ON COLUMN transactions.created_at IS 'Fecha de creación del registro';

COMMENT ON COLUMN transactions.updated_at IS 'Fecha de última actualización del registro';