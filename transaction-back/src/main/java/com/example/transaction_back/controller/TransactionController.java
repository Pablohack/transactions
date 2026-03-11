package com.example.transaction_back.controller;

import com.example.transaction_back.dto.CreateTransactionRequest;
import com.example.transaction_back.dto.TransactionResponse;
import com.example.transaction_back.dto.UpdateTransactionRequest;
import com.example.transaction_back.service.ITransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final ITransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> listarTodos() {
        return ResponseEntity.ok(transactionService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(transactionService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> crear(@RequestBody @Valid CreateTransactionRequest request) {
        TransactionResponse response = transactionService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> actualizar(
            @PathVariable Integer id,
            @RequestBody @Valid UpdateTransactionRequest request) {
        return ResponseEntity.ok(transactionService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        transactionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
