package com.example.project_al.modules.user.domain;

import com.example.project_al.modules.stores.domain.Store;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sellers")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Seller extends User {

    @Column(name = "seller_type")
    private String type = "INDIVIDUAL";

    @Column(name = "store_name")
    private String storeName;

    @Column(name = "business_registration")
    private String businessRegistration;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Store> stores = new ArrayList<>();

    @Override
    public String getUserType() {
        return "SELLER";
    }

    // operation1 from UML
    public String operation1(String param1) {
        return "Seller operation1: " + param1;
    }

    // operation2 from UML
    public void operation2(String param1) {
        System.out.println("Seller operation2 with param: " + param1);
    }

    // operation3 from UML
    public void operation3() {
        System.out.println("Seller operation3 executed");
    }
}