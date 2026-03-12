package com.example.transaction_back.mapper;

import com.example.transaction_back.dto.CreateTransactionRequest;
import com.example.transaction_back.dto.TransactionResponse;
import com.example.transaction_back.dto.UpdateTransactionRequest;
import com.example.transaction_back.model.Transaction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Componente de mapeo entre entidades Transaction y sus DTOs.
 * Utiliza ModelMapper para reducir código boilerplate y aplicar DRY.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionMapper {

    private final ModelMapper modelMapper;

    /**
     * Convierte una entidad Transaction a TransactionResponse DTO.
     *
     * @param transaction La entidad a convertir
     * @return El DTO de respuesta
     */
    public TransactionResponse toResponse(Transaction transaction) {
        log.debug("Mapeando Transaction a TransactionResponse - ID: {}", transaction.getId());
        return modelMapper.map(transaction, TransactionResponse.class);
    }

    /**
     * Convierte una lista de entidades Transaction a una lista de TransactionResponse DTOs.
     *
     * @param transactions La lista de entidades a convertir
     * @return La lista de DTOs de respuesta
     */
    public List<TransactionResponse> toResponseList(List<Transaction> transactions) {
        log.debug("Mapeando {} transacciones a TransactionResponse", transactions.size());
        return transactions.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convierte un CreateTransactionRequest DTO a una entidad Transaction.
     *
     * @param request El DTO de creación
     * @return La entidad Transaction
     */
    public Transaction toEntity(CreateTransactionRequest request) {
        log.debug("Mapeando CreateTransactionRequest a Transaction");
        return modelMapper.map(request, Transaction.class);
    }

    /**
     * Actualiza una entidad Transaction existente con los datos de UpdateTransactionRequest.
     * Preserva los campos de auditoría y el ID.
     *
     * @param request El DTO con los datos a actualizar
     * @param existingTransaction La entidad existente a actualizar
     */
    public void updateEntity(UpdateTransactionRequest request, Transaction existingTransaction) {
        log.debug("Actualizando Transaction ID: {} con datos de UpdateTransactionRequest", 
                  existingTransaction.getId());
        
        // ModelMapper mapea solo los campos modificables, preservando id y campos de auditoría
        modelMapper.map(request, existingTransaction);
    }
}
