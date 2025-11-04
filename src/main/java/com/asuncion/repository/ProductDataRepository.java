package com.asuncion.repository;

import com.asuncion.entity.ProductData;
import org.springframework.data.repository.CrudRepository;

public interface ProductDataRepository extends CrudRepository<ProductData, Integer> {
}
