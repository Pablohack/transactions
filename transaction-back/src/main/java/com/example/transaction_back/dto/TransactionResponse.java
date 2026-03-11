package com.example.transaction_back.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Integer id;
    private Integer amount;
    private String business;
    private String tenpista;
    private String date;
}
