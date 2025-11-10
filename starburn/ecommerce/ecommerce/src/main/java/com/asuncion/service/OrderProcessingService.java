package com.asuncion.service;

import com.asuncion.dto.CreateOrderRequest;

public interface OrderProcessingService {
    Long createOrder(CreateOrderRequest request);
}


