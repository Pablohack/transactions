package com.example.transaction_back.controller;

import com.example.transaction_back.model.Transaction;
import com.example.transaction_back.service.ITransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final ITransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> listarTodos() {
        try{
            List<Transaction> transactions = transactionService.listarTodos();
            return ResponseEntity.ok(transactions);
        }catch (Error error){
            throw new Error(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> buscarPorId(@PathVariable Integer id) {
        return transactionService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Transaction> crear(@RequestBody Transaction transaction) {
        try {
            Transaction nuevaTransaction = transactionService.crear(transaction);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTransaction);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> actualizar(@PathVariable Integer id, @RequestBody Transaction transaction) {
        return transactionService.buscarPorId(id)
                .map(t -> ResponseEntity.ok(transactionService.actualizar(id, transaction)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        return transactionService.buscarPorId(id)
                .map(t -> {
                    transactionService.eliminar(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
