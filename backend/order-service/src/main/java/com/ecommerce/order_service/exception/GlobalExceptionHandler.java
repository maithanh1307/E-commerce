package com.ecommerce.order_service.exception;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleRuntimeException(
            RuntimeException exception) {

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        response.put(
                "status",
                400
        );

        response.put(
                "error",
                "Bad Request"
        );

        response.put(
                "message",
                exception.getMessage()
        );

        return response;
    }
}
