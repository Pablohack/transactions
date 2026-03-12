package com.example.transaction_back.service;

import com.example.transaction_back.dto.CreateTransactionRequest;
import com.example.transaction_back.dto.TransactionResponse;
import com.example.transaction_back.dto.UpdateTransactionRequest;
import com.example.transaction_back.exception.ResourceNotFoundException;
import com.example.transaction_back.mapper.TransactionMapper;
import com.example.transaction_back.model.Transaction;
import com.example.transaction_back.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private TransactionMapper mapper;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private Transaction transaction;
    private TransactionResponse transactionResponse;

    @BeforeEach
    void setUp() {
        transaction = new Transaction();
        transaction.setId(1L);
        transaction.setAmount(new BigDecimal("50000"));
        transaction.setBusiness("Supermercado");
        transaction.setTenpista("Juan Pérez");
        transaction.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

        transactionResponse = TransactionResponse.builder()
                .id(1L)
                .amount(new BigDecimal("50000"))
                .business("Supermercado")
                .tenpista("Juan Pérez")
                .date(LocalDateTime.of(2026, 3, 9, 14, 30))
                .build();
    }

    @Nested
    @DisplayName("listarTodos")
    class ListarTodos {

        @Test
        @DisplayName("debe retornar lista de transacciones como DTOs")
        void shouldReturnAllTransactions() {
            when(transactionRepository.findAll()).thenReturn(List.of(transaction));
            when(mapper.toResponseList(List.of(transaction))).thenReturn(List.of(transactionResponse));

            List<TransactionResponse> result = transactionService.listarTodos();

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getId()).isEqualTo(1L);
            assertThat(result.get(0).getAmount()).isEqualByComparingTo(new BigDecimal("50000"));
            assertThat(result.get(0).getBusiness()).isEqualTo("Supermercado");
            assertThat(result.get(0).getTenpista()).isEqualTo("Juan Pérez");
            verify(transactionRepository).findAll();
            verify(mapper).toResponseList(List.of(transaction));
        }

        @Test
        @DisplayName("debe retornar lista vacía cuando no hay transacciones")
        void shouldReturnEmptyList() {
            when(transactionRepository.findAll()).thenReturn(Collections.emptyList());
            when(mapper.toResponseList(Collections.emptyList())).thenReturn(Collections.emptyList());

            List<TransactionResponse> result = transactionService.listarTodos();

            assertThat(result).isEmpty();
            verify(transactionRepository).findAll();
        }
    }

    @Nested
    @DisplayName("buscarPorId")
    class BuscarPorId {

        @Test
        @DisplayName("debe retornar la transacción cuando existe")
        void shouldReturnTransactionWhenExists() {
            when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
            when(mapper.toResponse(transaction)).thenReturn(transactionResponse);

            TransactionResponse result = transactionService.buscarPorId(1L);

            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getBusiness()).isEqualTo("Supermercado");
            assertThat(result.getAmount()).isEqualByComparingTo(new BigDecimal("50000"));
            verify(transactionRepository).findById(1L);
            verify(mapper).toResponse(transaction);
        }

        @Test
        @DisplayName("debe lanzar ResourceNotFoundException cuando no existe")
        void shouldThrowWhenNotFound() {
            when(transactionRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> transactionService.buscarPorId(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Transacción")
                    .hasMessageContaining("99");
        }
    }

    @Nested
    @DisplayName("crear")
    class Crear {

        @Test
        @DisplayName("debe crear una transacción y retornar el DTO de respuesta")
        void shouldCreateTransaction() {
            CreateTransactionRequest request = new CreateTransactionRequest();
            request.setAmount(new BigDecimal("30000"));
            request.setBusiness("Farmacia");
            request.setTenpista("María González");
            request.setDate(LocalDateTime.of(2026, 3, 10, 12, 0));

            Transaction newEntity = new Transaction();
            newEntity.setAmount(new BigDecimal("30000"));
            newEntity.setBusiness("Farmacia");
            newEntity.setTenpista("María González");
            newEntity.setDate(LocalDateTime.of(2026, 3, 10, 12, 0));

            Transaction saved = new Transaction();
            saved.setId(2L);
            saved.setAmount(new BigDecimal("30000"));
            saved.setBusiness("Farmacia");
            saved.setTenpista("María González");
            saved.setDate(LocalDateTime.of(2026, 3, 10, 12, 0));

            TransactionResponse expectedResponse = TransactionResponse.builder()
                    .id(2L)
                    .amount(new BigDecimal("30000"))
                    .business("Farmacia")
                    .tenpista("María González")
                    .date(LocalDateTime.of(2026, 3, 10, 12, 0))
                    .build();

            when(mapper.toEntity(request)).thenReturn(newEntity);
            when(transactionRepository.save(newEntity)).thenReturn(saved);
            when(mapper.toResponse(saved)).thenReturn(expectedResponse);

            TransactionResponse result = transactionService.crear(request);

            assertThat(result.getId()).isEqualTo(2L);
            assertThat(result.getAmount()).isEqualByComparingTo(new BigDecimal("30000"));
            assertThat(result.getBusiness()).isEqualTo("Farmacia");
            assertThat(result.getTenpista()).isEqualTo("María González");
            verify(mapper).toEntity(request);
            verify(transactionRepository).save(newEntity);
            verify(mapper).toResponse(saved);
        }
    }

    @Nested
    @DisplayName("actualizar")
    class Actualizar {

        @Test
        @DisplayName("debe actualizar una transacción existente")
        void shouldUpdateTransaction() {
            UpdateTransactionRequest request = new UpdateTransactionRequest();
            request.setAmount(new BigDecimal("35000"));
            request.setBusiness("Supermercado Updated");
            request.setTenpista("Juan Pérez");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            Transaction updated = new Transaction();
            updated.setId(1L);
            updated.setAmount(new BigDecimal("35000"));
            updated.setBusiness("Supermercado Updated");
            updated.setTenpista("Juan Pérez");
            updated.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            TransactionResponse expectedResponse = TransactionResponse.builder()
                    .id(1L)
                    .amount(new BigDecimal("35000"))
                    .business("Supermercado Updated")
                    .tenpista("Juan Pérez")
                    .date(LocalDateTime.of(2026, 3, 9, 14, 30))
                    .build();

            when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));
            when(transactionRepository.save(transaction)).thenReturn(updated);
            when(mapper.toResponse(updated)).thenReturn(expectedResponse);

            TransactionResponse result = transactionService.actualizar(1L, request);

            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getAmount()).isEqualByComparingTo(new BigDecimal("35000"));
            assertThat(result.getBusiness()).isEqualTo("Supermercado Updated");
            verify(transactionRepository).findById(1L);
            verify(mapper).updateEntity(request, transaction);
            verify(transactionRepository).save(transaction);
            verify(mapper).toResponse(updated);
        }

        @Test
        @DisplayName("debe lanzar ResourceNotFoundException cuando la transacción no existe")
        void shouldThrowWhenNotFound() {
            UpdateTransactionRequest request = new UpdateTransactionRequest();
            request.setAmount(new BigDecimal("35000"));
            request.setBusiness("Test");
            request.setTenpista("Test");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            when(transactionRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> transactionService.actualizar(99L, request))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }

    @Nested
    @DisplayName("eliminar")
    class Eliminar {

        @Test
        @DisplayName("debe eliminar cuando la transacción existe")
        void shouldDeleteTransaction() {
            when(transactionRepository.existsById(1L)).thenReturn(true);

            transactionService.eliminar(1L);

            verify(transactionRepository).deleteById(1L);
        }

        @Test
        @DisplayName("debe lanzar ResourceNotFoundException cuando no existe")
        void shouldThrowWhenNotFound() {
            when(transactionRepository.existsById(99L)).thenReturn(false);

            assertThatThrownBy(() -> transactionService.eliminar(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");

            verify(transactionRepository, never()).deleteById(any());
        }
    }
}
