package com.example.transaction_back.repository;

import com.example.transaction_back.model.Transaction;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Profile("!local")
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
}
