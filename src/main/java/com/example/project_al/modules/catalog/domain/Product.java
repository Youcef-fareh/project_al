package com.example.project_al.modules.catalog.domain;

import com.example.project_al.modules.stores.domain.Store;
import com.example.project_al.shared.kernel.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(unique = true)
    private String sku;

    @Column(columnDefinition = "TEXT")
    private String options;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    // Constructors
    public Product() {
    }

    public Product(String name, String description, BigDecimal price, String sku,
                   String options, Integer quantity, String imageUrl) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.sku = sku;
        this.options = options;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    // Business methods from UML
    public void command() {
        System.out.println("Product " + name + " has been commanded");
    }

    public String echovecOption() {
        return "Echovec option: " + options;
    }

    public List<String> idspontedList() {
        List<String> sponsoredList = new ArrayList<>();
        if (price.compareTo(new BigDecimal("50")) > 0) {
            sponsoredList.add("SPONSORED");
        }
        return sponsoredList;
    }

    public void operations3() {
        System.out.println("Product operations3 executed");
    }

    public void reduceQuantity(Integer amount) {
        if (this.quantity < amount) {
            throw new RuntimeException("Insufficient stock for product: " + name);
        }
        this.quantity -= amount;
    }

    public void increaseQuantity(Integer amount) {
        this.quantity += amount;
    }
}