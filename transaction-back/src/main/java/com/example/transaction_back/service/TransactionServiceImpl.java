package com.example.transaction_back.service;

import com.example.transaction_back.dto.CreateTransactionRequest;
import com.example.transaction_back.dto.TransactionResponse;
import com.example.transaction_back.dto.UpdateTransactionRequest;
import com.example.transaction_back.exception.ResourceNotFoundException;
import com.example.transaction_back.model.Transaction;
import com.example.transaction_back.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements ITransactionService {

    private final TransactionRepository transactionRepository;

    @Override
    public List<TransactionResponse> listarTodos() {
        return transactionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public TransactionResponse buscarPorId(Integer id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción", id));
        return toResponse(transaction);
    }

    @Override
    public TransactionResponse crear(CreateTransactionRequest request) {
        Transaction transaction = toEntity(request);
        Transaction saved = transactionRepository.save(transaction);
        return toResponse(saved);
    }

    @Override
    public TransactionResponse actualizar(Integer id, UpdateTransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción", id));

        transaction.setAmount(request.getAmount());
        transaction.setBusiness(request.getBusiness());
        transaction.setTenpista(request.getTenpista());
        transaction.setDate(LocalDateTime.parse(request.getDate()));

        Transaction updated = transactionRepository.save(transaction);
        return toResponse(updated);
    }

    @Override
    public void eliminar(Integer id) {
        if (!transactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Transacción", id);
        }
        transactionRepository.deleteById(id);
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .business(transaction.getBusiness())
                .tenpista(transaction.getTenpista())
                .date(transaction.getDate().toString())
                .build();
    }

    private Transaction toEntity(CreateTransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setBusiness(request.getBusiness());
        transaction.setTenpista(request.getTenpista());
        transaction.setDate(LocalDateTime.parse(request.getDate()));
        return transaction;
    }
}
