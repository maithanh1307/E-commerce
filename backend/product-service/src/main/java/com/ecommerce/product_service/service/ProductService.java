package com.ecommerce.product_service.service;
import com.ecommerce.product_service.dto.ProductRequestDto;
import com.ecommerce.product_service.dto.ProductResponseDto;
import com.ecommerce.product_service.entity.Product;
import com.ecommerce.product_service.entity.ProductStatus;
import com.ecommerce.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductCacheService productCacheService;

    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto request) {

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .stockQuantity(request.getStockQuantity())
                .status(ProductStatus.ACTIVE)
                .build();

        Product savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllProducts() {

        // check Redis
        List<ProductResponseDto> cached =
                productCacheService.getAll();

        if (cached != null) {

            System.out.println(
                    "Redis cache HIT: products:all"
            );

            return cached;
        }

        System.out.println(
                "Redis cache MISS: products:all"
        );

        // get product all
        List<ProductResponseDto> products =
                productRepository.findAll()
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        // save to Redis
        productCacheService.saveAll(products);

        return products;
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long id) {
        // check redis
        ProductResponseDto cached =
                productCacheService.get(id);

        if (cached != null) {

            System.out.println(
                    "Redis cache HIT: product:" + id
            );

            return cached;
        }

        System.out.println(
                "Redis cache MISS: product:" + id
        );

        // get product
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id)
                );

        ProductResponseDto productResponseDto =  mapToResponse(product);

        // save to redis
        productCacheService.save(productResponseDto);

        return productResponseDto;
    }

    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductRequestDto request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id)
                );

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        product.setStockQuantity(request.getStockQuantity());

        Product updatedProduct = productRepository.save(product);

        // delete old cache
        productCacheService.delete(id);

        // delete old cache for all products
        productCacheService.deleteAll();

        return mapToResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id)
                );

        productRepository.delete(product);
        productCacheService.delete(id);
        productCacheService.deleteAll();
    }

    @Transactional
    public ProductResponseDto changeStatus(Long id, ProductStatus status) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id)
                );

        product.setStatus(status);
        productCacheService.delete(id);
        productCacheService.deleteAll();

        return mapToResponse(productRepository.save(product));
    }

    private ProductResponseDto mapToResponse(Product product) {

        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .category(product.getCategory())
                .stockQuantity(product.getStockQuantity())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
