package com.ecommerce.inventory_service.service;

import com.ecommerce.inventory_service.dto.InventoryRequestDto;
import com.ecommerce.inventory_service.dto.InventoryResponseDto;
import com.ecommerce.inventory_service.dto.StockMovementResponseDto;
import com.ecommerce.inventory_service.dto.StockRequestDto;
import com.ecommerce.inventory_service.entity.Inventory;
import com.ecommerce.inventory_service.entity.StockMovement;
import com.ecommerce.inventory_service.entity.StockMovementType;
import com.ecommerce.inventory_service.repository.InventoryRepository;
import com.ecommerce.inventory_service.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    private final StockMovementRepository stockMovementRepository;

    @Transactional
    public InventoryResponseDto createInventory(InventoryRequestDto request) {

        if (inventoryRepository.existsByProductId(
                request.getProductId())) {

            throw new RuntimeException(
                    "Inventory already exists for product "
                            + request.getProductId());
        }

        Inventory inventory = Inventory.builder()
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .reservedQuantity(0)
                .build();

        inventory = inventoryRepository.save(inventory);

        if (request.getQuantity() > 0) {

            createMovement(
                    request.getProductId(),
                    StockMovementType.IN,
                    request.getQuantity(),
                    "Initial stock"
            );
        }

        return toResponse(inventory);
    }

    @Transactional(readOnly = true)
    public InventoryResponseDto getInventoryByProductId(Long productId) {

        Inventory inventory = getInventory(productId);

        return toResponse(inventory);
    }

    @Transactional
    public InventoryResponseDto stockIn(Long productId, StockRequestDto request) {

        Inventory inventory = getInventory(productId);

        inventory.setQuantity(
                inventory.getQuantity()
                        + request.getQuantity()
        );

        inventoryRepository.save(inventory);

        createMovement(
                productId,
                StockMovementType.IN,
                request.getQuantity(),
                request.getReason()
        );

        return toResponse(inventory);
    }

    @Transactional
    public InventoryResponseDto stockOut(Long productId, StockRequestDto request) {

        Inventory inventory = getInventory(productId);

        int available =
                inventory.getAvailableQuantity();

        if (available < request.getQuantity()) {

            throw new RuntimeException(
                    "Not enough available stock. "
                            + "Available: " + available
            );
        }

        inventory.setQuantity(
                inventory.getQuantity()
                        - request.getQuantity()
        );

        inventoryRepository.save(inventory);

        createMovement(
                productId,
                StockMovementType.OUT,
                request.getQuantity(),
                request.getReason()
        );

        return toResponse(inventory);
    }

    @Transactional
    public InventoryResponseDto reserve(Long productId, StockRequestDto request) {

        Inventory inventory = getInventory(productId);

        int available =
                inventory.getAvailableQuantity();

        if (available < request.getQuantity()) {

            throw new RuntimeException(
                    "Not enough available stock. "
                            + "Available: " + available
            );
        }

        inventory.setReservedQuantity(
                inventory.getReservedQuantity()
                        + request.getQuantity()
        );

        inventoryRepository.save(inventory);

        createMovement(
                productId,
                StockMovementType.RESERVE,
                request.getQuantity(),
                request.getReason()
        );

        return toResponse(inventory);
    }

    @Transactional
    public InventoryResponseDto release(Long productId, StockRequestDto request) {

        Inventory inventory = getInventory(productId);

        if (inventory.getReservedQuantity()
                < request.getQuantity()) {

            throw new RuntimeException(
                    "Release quantity cannot be greater "
                            + "than reserved quantity."
            );
        }

        inventory.setReservedQuantity(
                inventory.getReservedQuantity()
                        - request.getQuantity()
        );

        inventoryRepository.save(inventory);

        createMovement(
                productId,
                StockMovementType.RELEASE,
                request.getQuantity(),
                request.getReason()
        );

        return toResponse(inventory);
    }

    @Transactional(readOnly = true)
    public List<StockMovementResponseDto> getMovements(Long productId) {

        return stockMovementRepository
                .findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toMovementResponse)
                .toList();
    }

    private Inventory getInventory(Long productId) {

        return inventoryRepository
                .findByProductId(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Inventory not found for product "
                                        + productId
                        )
                );
    }


    private void createMovement(
            Long productId,
            StockMovementType type,
            Integer quantity,
            String reason) {

        StockMovement movement =
                StockMovement.builder()
                        .productId(productId)
                        .type(type)
                        .quantity(quantity)
                        .reason(reason)
                        .build();

        stockMovementRepository.save(movement);
    }


    private InventoryResponseDto toResponse(
            Inventory inventory) {

        return InventoryResponseDto.builder()
                .id(inventory.getId())
                .productId(inventory.getProductId())
                .quantity(inventory.getQuantity())
                .reservedQuantity(
                        inventory.getReservedQuantity()
                )
                .availableQuantity(
                        inventory.getAvailableQuantity()
                )
                .build();
    }


    private StockMovementResponseDto toMovementResponse(
            StockMovement movement) {

        return StockMovementResponseDto.builder()
                .id(movement.getId())
                .productId(movement.getProductId())
                .type(movement.getType())
                .quantity(movement.getQuantity())
                .reason(movement.getReason())
                .createdAt(movement.getCreatedAt())
                .build();
    }
}
