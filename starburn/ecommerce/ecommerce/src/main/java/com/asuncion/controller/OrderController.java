package com.asuncion.controller;

import com.asuncion.dto.CreateOrderRequest;
import com.asuncion.service.OrderProcessingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    private final OrderProcessingService orderProcessingService;

    public OrderController(OrderProcessingService orderProcessingService) {
        this.orderProcessingService = orderProcessingService;
    }

    @PostMapping("/api/orders")
    public ResponseEntity<Map<String, Long>> create(@RequestBody CreateOrderRequest request) {
        Long orderId = orderProcessingService.createOrder(request);
        Map<String, Long> body = new HashMap<>();
        body.put("orderId", orderId);
        return ResponseEntity.ok(body);
    }
}
