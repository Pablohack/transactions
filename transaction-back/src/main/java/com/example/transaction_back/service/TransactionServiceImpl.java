package com.example.transaction_back.service;

import com.example.transaction_back.dto.CreateTransactionRequest;
import com.example.transaction_back.dto.TransactionResponse;
import com.example.transaction_back.dto.UpdateTransactionRequest;
import com.example.transaction_back.exception.ResourceNotFoundException;
import com.example.transaction_back.mapper.TransactionMapper;
import com.example.transaction_back.model.Transaction;
import com.example.transaction_back.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementación del servicio de transacciones.
 * Aplica patrones DRY usando ModelMapper para reducir código boilerplate.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements ITransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> listarTodos() {
        log.info("Listando todas las transacciones");
        List<Transaction> transactions = transactionRepository.findAll();
        log.debug(" Se encontraron {} transacciones", transactions.size());
        return mapper.toResponseList(transactions);
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponse buscarPorId(Long id) {
        log.info("Buscando transacción con ID: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Transacción no encontrada - ID: {}", id);
                    return new ResourceNotFoundException("Transacción", id);
                });
        log.debug(" Transacción encontrada - ID: {}, Amount: {}", id, transaction.getAmount());
        return mapper.toResponse(transaction);
    }

    @Override
    public TransactionResponse crear(CreateTransactionRequest request) {
        log.info("Creando nueva transacción - Business: {}, Amount: {}", 
                 request.getBusiness(), request.getAmount());
        
        Transaction transaction = mapper.toEntity(request);
        Transaction saved = transactionRepository.save(transaction);
        
        log.info("Transacción creada exitosamente - ID: {}", saved.getId());
        return mapper.toResponse(saved);
    }

    @Override
    public TransactionResponse actualizar(Long id, UpdateTransactionRequest request) {
        log.info("Actualizando transacción - ID: {}", id);
        
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Transacción no encontrada para actualizar - ID: {}", id);
                    return new ResourceNotFoundException("Transacción", id);
                });

        mapper.updateEntity(request, transaction);
        Transaction updated = transactionRepository.save(transaction);
        
        log.info("Transacción actualizada exitosamente - ID: {}", id);
        return mapper.toResponse(updated);
    }

    @Override
    public void eliminar(Long id) {
        log.info("Eliminando transacción - ID: {}", id);
        
        if (!transactionRepository.existsById(id)) {
            log.error("Transacción no encontrada para eliminar - ID: {}", id);
            throw new ResourceNotFoundException("Transacción", id);
        }
        
        transactionRepository.deleteById(id);
        log.info("Transacción eliminada exitosamente - ID: {}", id);
    }
}
