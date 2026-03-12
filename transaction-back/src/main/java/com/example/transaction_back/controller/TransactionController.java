package com.example.transaction_back.controller;

import com.example.transaction_back.dto.CreateTransactionRequest;
import com.example.transaction_back.dto.TransactionResponse;
import com.example.transaction_back.dto.UpdateTransactionRequest;
import com.example.transaction_back.service.ITransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final ITransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> listarTodos() {
        log.debug("GET /api/transactions - Listando todas las transacciones");
        return ResponseEntity.ok(transactionService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> buscarPorId(@PathVariable Long id) {
        log.debug("GET /api/transactions/{} - Buscando transacción", id);
        return ResponseEntity.ok(transactionService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> crear(@RequestBody @Valid CreateTransactionRequest request) {
        log.debug("POST /api/transactions - Creando nueva transacción");
        TransactionResponse response = transactionService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid UpdateTransactionRequest request) {
        log.debug("PUT /api/transactions/{} - Actualizando transacción", id);
        return ResponseEntity.ok(transactionService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        log.debug("DELETE /api/transactions/{} - Eliminando transacción", id);
        transactionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
