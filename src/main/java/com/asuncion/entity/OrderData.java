package com.asuncion.entity;

import javax.persistence.*;

@Entity
@Table(name = "order_data")
public class OrderData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderId") // 👈 maps the field to the actual column
    private int id;
}
