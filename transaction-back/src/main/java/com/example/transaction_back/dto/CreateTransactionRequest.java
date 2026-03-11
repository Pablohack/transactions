package com.example.transaction_back.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {

    @NotNull(message = "El monto es requerido")
    @Positive(message = "El monto debe ser mayor a 0")
    @Max(value = 2147483647, message = "El monto excede el máximo permitido")
    private Integer amount;

    @NotBlank(message = "El giro o comercio es requerido")
    @Size(max = 120, message = "El giro o comercio no puede exceder 120 caracteres")
    private String business;

    @NotBlank(message = "El nombre del Tenpista es requerido")
    @Size(max = 120, message = "El nombre del Tenpista no puede exceder 120 caracteres")
    private String tenpista;

    @NotNull(message = "La fecha es requerida")
    private String date;
}
