package com.ecommerce.product_service.repository;

import com.ecommerce.product_service.entity.Product;
import com.ecommerce.product_service.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStatus(ProductStatus status);

    List<Product> findByCategory(String category);

    List<Product> findByNameContainingIgnoreCase(String name);
}
