
package com.campushub.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final List<Product> products = new ArrayList<>(
            List.of(
                    new Product(1L, "MacBook Air", 650.0, "Like new"),
                    new Product(2L, "Desk Lamp", 15.0, "Good condition"),
                    new Product(3L, "Mini Fridge", 80.0, "Used")
            )
    );

    private final AtomicLong nextId = new AtomicLong(4);

    @GetMapping
    public synchronized List<Product> getProducts() {
        return new ArrayList<>(products);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public synchronized Product createProduct(
            @RequestBody ProductRequest request
    ) {
        if (request == null
                || request.name() == null
                || request.name().isBlank()
                || request.price() == null
                || !Double.isFinite(request.price())
                || request.price() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Name and positive price are required"
            );
        }

        Product product = new Product(
                nextId.getAndIncrement(),
                request.name(),
                request.price(),
                request.description()
        );

        products.add(product);
        return product;
    }

    public record ProductRequest(
            String name,
            Double price,
            String description
    ) {}

    public record Product(
            Long id,
            String name,
            Double price,
            String description
    ) {}
}
