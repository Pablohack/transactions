package com.example.transaction_back.controller;

import com.example.transaction_back.config.GlobalExceptionHandler;
import com.example.transaction_back.dto.CreateTransactionRequest;
import com.example.transaction_back.dto.TransactionResponse;
import com.example.transaction_back.dto.UpdateTransactionRequest;
import com.example.transaction_back.exception.ResourceNotFoundException;
import com.example.transaction_back.service.ITransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Mock
    private ITransactionService transactionService;

    @InjectMocks
    private TransactionController transactionController;

    private static final String BASE_URL = "/api/transactions";

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(transactionController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }

    private TransactionResponse buildResponse() {
        return TransactionResponse.builder()
                .id(1L)
                .amount(new BigDecimal("50000"))
                .business("Supermercado")
                .tenpista("Juan Pérez")
                .date(LocalDateTime.of(2026, 3, 9, 14, 30))
                .build();
    }

    @Nested
    @DisplayName("GET /api/transactions")
    class ListarTodos {

        @Test
        @DisplayName("debe retornar 200 con lista de transacciones")
        void shouldReturnTransactions() throws Exception {
            when(transactionService.listarTodos()).thenReturn(List.of(buildResponse()));

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(1)))
                    .andExpect(jsonPath("$[0].id").value(1))
                    .andExpect(jsonPath("$[0].amount").value(50000))
                    .andExpect(jsonPath("$[0].business").value("Supermercado"))
                    .andExpect(jsonPath("$[0].tenpista").value("Juan Pérez"));

            verify(transactionService).listarTodos();
        }

        @Test
        @DisplayName("debe retornar 200 con lista vacía")
        void shouldReturnEmptyList() throws Exception {
            when(transactionService.listarTodos()).thenReturn(Collections.emptyList());

            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(0)));
        }
    }

    @Nested
    @DisplayName("GET /api/transactions/{id}")
    class BuscarPorId {

        @Test
        @DisplayName("debe retornar 200 cuando la transacción existe")
        void shouldReturnTransaction() throws Exception {
            when(transactionService.buscarPorId(1L)).thenReturn(buildResponse());

            mockMvc.perform(get(BASE_URL + "/1"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.amount").value(50000))
                    .andExpect(jsonPath("$.business").value("Supermercado"));
        }

        @Test
        @DisplayName("debe retornar 404 cuando la transacción no existe")
        void shouldReturn404WhenNotFound() throws Exception {
            when(transactionService.buscarPorId(99L))
                    .thenThrow(new ResourceNotFoundException("Transacción", 99L));

            mockMvc.perform(get(BASE_URL + "/99"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.error").value("Recurso no encontrado"))
                    .andExpect(jsonPath("$.message", containsString("99")));
        }
    }

    @Nested
    @DisplayName("POST /api/transactions")
    class Crear {

        @Test
        @DisplayName("debe retornar 201 al crear con datos válidos")
        void shouldCreateTransaction() throws Exception {
            CreateTransactionRequest request = new CreateTransactionRequest();
            request.setAmount(new BigDecimal("50000"));
            request.setBusiness("Supermercado");
            request.setTenpista("Juan Pérez");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            when(transactionService.crear(any(CreateTransactionRequest.class)))
                    .thenReturn(buildResponse());

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.amount").value(50000));

            verify(transactionService).crear(any(CreateTransactionRequest.class));
        }

        @Test
        @DisplayName("debe retornar 400 cuando el monto es nulo")
        void shouldReturn400WhenAmountIsNull() throws Exception {
            CreateTransactionRequest request = new CreateTransactionRequest();
            request.setBusiness("Supermercado");
            request.setTenpista("Juan Pérez");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.error").value("Error de validación"))
                    .andExpect(jsonPath("$.errors", hasSize(1)))
                    .andExpect(jsonPath("$.errors[0].field").value("amount"));

            verify(transactionService, never()).crear(any());
        }

        @Test
        @DisplayName("debe retornar 400 cuando el monto es negativo")
        void shouldReturn400WhenAmountIsNegative() throws Exception {
            CreateTransactionRequest request = new CreateTransactionRequest();
            request.setAmount(new BigDecimal("-100"));
            request.setBusiness("Supermercado");
            request.setTenpista("Juan Pérez");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors[0].field").value("amount"));

            verify(transactionService, never()).crear(any());
        }

        @Test
        @DisplayName("debe retornar 400 cuando el business está vacío")
        void shouldReturn400WhenBusinessIsBlank() throws Exception {
            CreateTransactionRequest request = new CreateTransactionRequest();
            request.setAmount(new BigDecimal("50000"));
            request.setBusiness("");
            request.setTenpista("Juan Pérez");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors[*].field", hasItem("business")));

            verify(transactionService, never()).crear(any());
        }

        @Test
        @DisplayName("debe retornar 400 cuando el tenpista está vacío")
        void shouldReturn400WhenTenpistaIsBlank() throws Exception {
            CreateTransactionRequest request = new CreateTransactionRequest();
            request.setAmount(new BigDecimal("50000"));
            request.setBusiness("Supermercado");
            request.setTenpista("");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors[*].field", hasItem("tenpista")));

            verify(transactionService, never()).crear(any());
        }

        @Test
        @DisplayName("debe retornar 400 cuando faltan todos los campos requeridos")
        void shouldReturn400WhenAllFieldsMissing() throws Exception {
            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors", hasSize(greaterThanOrEqualTo(3))));

            verify(transactionService, never()).crear(any());
        }

        @Test
        @DisplayName("debe retornar 400 cuando business excede 120 caracteres")
        void shouldReturn400WhenBusinessTooLong() throws Exception {
            CreateTransactionRequest request = new CreateTransactionRequest();
            request.setAmount(new BigDecimal("50000"));
            request.setBusiness("a".repeat(121));
            request.setTenpista("Juan Pérez");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            mockMvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors[*].field", hasItem("business")));

            verify(transactionService, never()).crear(any());
        }
    }

    @Nested
    @DisplayName("PUT /api/transactions/{id}")
    class Actualizar {

        @Test
        @DisplayName("debe retornar 200 al actualizar con datos válidos")
        void shouldUpdateTransaction() throws Exception {
            UpdateTransactionRequest request = new UpdateTransactionRequest();
            request.setAmount(new BigDecimal("35000"));
            request.setBusiness("Supermercado Updated");
            request.setTenpista("Juan Pérez");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            TransactionResponse updatedResponse = TransactionResponse.builder()
                    .id(1L)
                    .amount(new BigDecimal("35000"))
                    .business("Supermercado Updated")
                    .tenpista("Juan Pérez")
                    .date(LocalDateTime.of(2026, 3, 9, 14, 30))
                    .build();

            when(transactionService.actualizar(eq(1L), any(UpdateTransactionRequest.class)))
                    .thenReturn(updatedResponse);

            mockMvc.perform(put(BASE_URL + "/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.amount").value(35000))
                    .andExpect(jsonPath("$.business").value("Supermercado Updated"));

            verify(transactionService).actualizar(eq(1L), any(UpdateTransactionRequest.class));
        }

        @Test
        @DisplayName("debe retornar 404 cuando la transacción no existe")
        void shouldReturn404WhenNotFound() throws Exception {
            UpdateTransactionRequest request = new UpdateTransactionRequest();
            request.setAmount(new BigDecimal("35000"));
            request.setBusiness("Test");
            request.setTenpista("Test");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            when(transactionService.actualizar(eq(99L), any(UpdateTransactionRequest.class)))
                    .thenThrow(new ResourceNotFoundException("Transacción", 99L));

            mockMvc.perform(put(BASE_URL + "/99")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.error").value("Recurso no encontrado"));
        }

        @Test
        @DisplayName("debe retornar 400 con datos inválidos")
        void shouldReturn400WithInvalidData() throws Exception {
            UpdateTransactionRequest request = new UpdateTransactionRequest();
            request.setAmount(new BigDecimal("-100"));
            request.setBusiness("");
            request.setTenpista("");
            request.setDate(LocalDateTime.of(2026, 3, 9, 14, 30));

            mockMvc.perform(put(BASE_URL + "/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors", hasSize(greaterThanOrEqualTo(2))));

            verify(transactionService, never()).actualizar(anyLong(), any());
        }
    }

    @Nested
    @DisplayName("DELETE /api/transactions/{id}")
    class Eliminar {

        @Test
        @DisplayName("debe retornar 204 al eliminar correctamente")
        void shouldDeleteTransaction() throws Exception {
            doNothing().when(transactionService).eliminar(1L);

            mockMvc.perform(delete(BASE_URL + "/1"))
                    .andExpect(status().isNoContent());

            verify(transactionService).eliminar(1L);
        }

        @Test
        @DisplayName("debe retornar 404 cuando la transacción no existe")
        void shouldReturn404WhenNotFound() throws Exception {
            doThrow(new ResourceNotFoundException("Transacción", 99L))
                    .when(transactionService).eliminar(99L);

            mockMvc.perform(delete(BASE_URL + "/99"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.error").value("Recurso no encontrado"));
        }
    }
}
