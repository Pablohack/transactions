package com.example.transaction_back.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resource, Integer id) {
        super(String.format("%s con id %d no encontrado", resource, id));
    }
}
