package com.example.transaction_back.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "monto", nullable = false)
    private Integer monto;

    @Column(name = "comercio", nullable = false)
    private String comercio;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "date_transaction", nullable = false)
    private LocalDateTime date_transaction;
}
