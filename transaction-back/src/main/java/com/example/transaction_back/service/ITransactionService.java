package com.example.transaction_back.service;

import com.example.transaction_back.dto.CreateTransactionRequest;
import com.example.transaction_back.dto.TransactionResponse;
import com.example.transaction_back.dto.UpdateTransactionRequest;

import java.util.List;

public interface ITransactionService {

    List<TransactionResponse> listarTodos();

    TransactionResponse buscarPorId(Integer id);

    TransactionResponse crear(CreateTransactionRequest request);

    TransactionResponse actualizar(Integer id, UpdateTransactionRequest request);

    void eliminar(Integer id);
}
