package com.asuncion.serviceimpl;

import com.asuncion.dto.CreateOrderRequest;
import com.asuncion.entity.OrderEntity;
import com.asuncion.entity.OrderItemEntity;
import com.asuncion.repository.OrderItemRepository;
import com.asuncion.repository.ProductDataRepository;
import com.asuncion.entity.ProductData;
import com.asuncion.repository.OrderRepository;
import com.asuncion.service.OrderProcessingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class OrderProcessingServiceImpl implements OrderProcessingService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductDataRepository productDataRepository;

    public OrderProcessingServiceImpl(OrderRepository orderRepository, OrderItemRepository orderItemRepository, ProductDataRepository productDataRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productDataRepository = productDataRepository;
    }

    @Override
    @Transactional
    public Long createOrder(CreateOrderRequest request) {
        OrderEntity order = new OrderEntity();
        order.setUserId(request.getUserId());
        order.setTotal(request.getTotal());
        OrderEntity saved = orderRepository.save(order);

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            orderItemRepository.saveAll(
                request.getItems().stream().map(it -> {
                    OrderItemEntity e = new OrderItemEntity();
                    e.setOrder(saved);
                    e.setProductId(it.getProductId());
                    e.setQuantity(it.getQuantity());
                    e.setPrice(it.getPrice());
                    try {
                        int prodId = Math.toIntExact(it.getProductId());
                        productDataRepository.findById(prodId).ifPresent(p -> e.setProductName(p.getName()));
                    } catch (ArithmeticException ex) {
                        // ignore if Long doesn't fit into int
                    }
                    return e;
                }).collect(Collectors.toList())
            );
        }
        return saved.getId();
    }
}


