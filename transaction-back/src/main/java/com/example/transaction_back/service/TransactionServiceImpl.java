package com.example.transaction_back.service;

import com.example.transaction_back.model.Transaction;
import com.example.transaction_back.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements ITransactionService {

    private final TransactionRepository transactionRepository;

    @Override
    public List<Transaction> listarTodos() {
        return transactionRepository.findAll();
    }

    @Override
    public Optional<Transaction> buscarPorId(Integer id) {
        return transactionRepository.findById(id);
    }

    @Override
    public Transaction crear(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction actualizar(Integer id, Transaction transaction) {
        transaction.setId(id);
        return transactionRepository.save(transaction);
    }

    @Override
    public void eliminar(Integer id) {
        transactionRepository.deleteById(id);
    }
}
