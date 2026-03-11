package com.example.transaction_back.service;

import com.example.transaction_back.dto.CreateTransactionRequest;
import com.example.transaction_back.dto.TransactionResponse;
import com.example.transaction_back.dto.UpdateTransactionRequest;
import com.example.transaction_back.exception.ResourceNotFoundException;
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

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private Transaction transaction;

    @BeforeEach
    void setUp() {
        transaction = new Transaction();
        transaction.setId(1);
        transaction.setAmount(50000);
        transaction.setBusiness("Supermercado");
        transaction.setTenpista("Juan Pérez");
        transaction.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));
    }

    @Nested
    @DisplayName("listarTodos")
    class ListarTodos {

        @Test
        @DisplayName("debe retornar lista de transacciones como DTOs")
        void shouldReturnAllTransactions() {
            when(transactionRepository.findAll()).thenReturn(List.of(transaction));

            List<TransactionResponse> result = transactionService.listarTodos();

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getId()).isEqualTo(1);
            assertThat(result.get(0).getAmount()).isEqualTo(50000);
            assertThat(result.get(0).getBusiness()).isEqualTo("Supermercado");
            assertThat(result.get(0).getTenpista()).isEqualTo("Juan Pérez");
            verify(transactionRepository, times(1)).findAll();
        }

        @Test
        @DisplayName("debe retornar lista vacía cuando no hay transacciones")
        void shouldReturnEmptyList() {
            when(transactionRepository.findAll()).thenReturn(Collections.emptyList());

            List<TransactionResponse> result = transactionService.listarTodos();

            assertThat(result).isEmpty();
            verify(transactionRepository, times(1)).findAll();
        }
    }

    @Nested
    @DisplayName("buscarPorId")
    class BuscarPorId {

        @Test
        @DisplayName("debe retornar la transacción cuando existe")
        void shouldReturnTransactionWhenExists() {
            when(transactionRepository.findById(1)).thenReturn(Optional.of(transaction));

            TransactionResponse result = transactionService.buscarPorId(1);

            assertThat(result.getId()).isEqualTo(1);
            assertThat(result.getBusiness()).isEqualTo("Supermercado");
            assertThat(result.getAmount()).isEqualTo(50000);
            verify(transactionRepository, times(1)).findById(1);
        }

        @Test
        @DisplayName("debe lanzar ResourceNotFoundException cuando no existe")
        void shouldThrowWhenNotFound() {
            when(transactionRepository.findById(99)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> transactionService.buscarPorId(99))
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
            request.setAmount(30000);
            request.setBusiness("Farmacia");
            request.setTenpista("María González");
            request.setDate("2026-03-10T12:00:00");

            Transaction saved = new Transaction();
            saved.setId(2);
            saved.setAmount(30000);
            saved.setBusiness("Farmacia");
            saved.setTenpista("María González");
            saved.setDate(LocalDateTime.of(2026, 3, 10, 12, 0));

            when(transactionRepository.save(any(Transaction.class))).thenReturn(saved);

            TransactionResponse result = transactionService.crear(request);

            assertThat(result.getId()).isEqualTo(2);
            assertThat(result.getAmount()).isEqualTo(30000);
            assertThat(result.getBusiness()).isEqualTo("Farmacia");
            assertThat(result.getTenpista()).isEqualTo("María González");
            verify(transactionRepository, times(1)).save(any(Transaction.class));
        }
    }

    @Nested
    @DisplayName("actualizar")
    class Actualizar {

        @Test
        @DisplayName("debe actualizar una transacción existente")
        void shouldUpdateTransaction() {
            UpdateTransactionRequest request = new UpdateTransactionRequest();
            request.setAmount(35000);
            request.setBusiness("Supermercado Updated");
            request.setTenpista("Juan Pérez");
            request.setDate("2026-03-09T14:30:00");

            Transaction updated = new Transaction();
            updated.setId(1);
            updated.setAmount(35000);
            updated.setBusiness("Supermercado Updated");
            updated.setTenpista("Juan Pérez");
            updated.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            when(transactionRepository.findById(1)).thenReturn(Optional.of(transaction));
            when(transactionRepository.save(any(Transaction.class))).thenReturn(updated);

            TransactionResponse result = transactionService.actualizar(1, request);

            assertThat(result.getId()).isEqualTo(1);
            assertThat(result.getAmount()).isEqualTo(35000);
            assertThat(result.getBusiness()).isEqualTo("Supermercado Updated");
            verify(transactionRepository, times(1)).findById(1);
            verify(transactionRepository, times(1)).save(any(Transaction.class));
        }

        @Test
        @DisplayName("debe lanzar ResourceNotFoundException cuando la transacción no existe")
        void shouldThrowWhenNotFound() {
            UpdateTransactionRequest request = new UpdateTransactionRequest();
            request.setAmount(35000);
            request.setBusiness("Test");
            request.setTenpista("Test");
            request.setDate("2026-03-09T14:30:00");

            when(transactionRepository.findById(99)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> transactionService.actualizar(99, request))
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
            when(transactionRepository.existsById(1)).thenReturn(true);

            transactionService.eliminar(1);

            verify(transactionRepository, times(1)).deleteById(1);
        }

        @Test
        @DisplayName("debe lanzar ResourceNotFoundException cuando no existe")
        void shouldThrowWhenNotFound() {
            when(transactionRepository.existsById(99)).thenReturn(false);

            assertThatThrownBy(() -> transactionService.eliminar(99))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");

            verify(transactionRepository, never()).deleteById(any());
        }
    }
}
