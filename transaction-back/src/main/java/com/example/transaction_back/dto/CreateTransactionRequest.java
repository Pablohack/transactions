package com.example.transaction_back.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTransactionRequest {

    @NotNull(message = "El monto es requerido")
    @Positive(message = "El monto debe ser mayor a 0")
    @DecimalMax(value = "999999999999.99", message = "El monto excede el máximo permitido")
    private BigDecimal amount;

    @NotBlank(message = "El giro o comercio es requerido")
    @Size(max = 120, message = "El giro o comercio no puede exceder 120 caracteres")
    private String business;

    @NotBlank(message = "El nombre del Tenpista es requerido")
    @Size(max = 120, message = "El nombre del Tenpista no puede exceder 120 caracteres")
    private String tenpista;

    @NotNull(message = "La fecha es requerida")
//    @Past(message = "La fecha de transacción no puede ser futura a la fecha y hora actual")
    private LocalDateTime date;
}
