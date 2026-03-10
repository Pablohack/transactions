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

    @Column(name = "amount", nullable = false)
    private Integer amount;

    @Column(name = "business", nullable = false)
    private String business;

    @Column(name = "tenpista", nullable = false)
    private String tenpista;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;
}
