package com.example.project_al.modules.user.domain;

import com.example.project_al.modules.stores.domain.Store;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sellers")
public class Seller extends User {

    @Column(name = "seller_type")
    private String type = "INDIVIDUAL";

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "business_registration")
    private String businessRegistration;

    @Column(name = "tax_id")
    private String taxId;

    @Column(name = "rating")
    private Double rating = 0.0;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Store> stores = new ArrayList<>();

    // Constructors
    public Seller() {
    }

    public Seller(Integer userListId, String nom, String email, String phoneNumber,
                  String sharestring, String password, String storeName, String type) {
        super(userListId, nom, email, phoneNumber, sharestring, password);
        this.storeName = storeName;
        this.type = type;
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getBusinessRegistration() {
        return businessRegistration;
    }

    public void setBusinessRegistration(String businessRegistration) {
        this.businessRegistration = businessRegistration;
    }

    public String getTaxId() {
        return taxId;
    }

    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public List<Store> getStores() {
        return stores;
    }

    public void setStores(List<Store> stores) {
        this.stores = stores;
    }

    @Override
    public String getUserType() {
        return "SELLER";
    }
}