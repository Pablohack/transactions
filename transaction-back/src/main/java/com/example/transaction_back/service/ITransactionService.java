package com.example.transaction_back.service;

import com.example.transaction_back.model.Transaction;

import java.util.List;
import java.util.Optional;

public interface ITransactionService {

    List<Transaction> listarTodos();

    Optional<Transaction> buscarPorId(Integer id);

    Transaction crear(Transaction transaction);

    Transaction actualizar(Integer id, Transaction transaction);

    void eliminar(Integer id);
}
