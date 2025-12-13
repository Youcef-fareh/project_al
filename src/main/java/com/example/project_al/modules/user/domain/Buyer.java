package com.example.project_al.modules.user.domain;

import com.example.project_al.modules.catalog.domain.Product;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "buyers")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Buyer extends User {

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "buyer_wishlist",
            joinColumns = @JoinColumn(name = "buyer_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> wishList = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "buyer_following",
            joinColumns = @JoinColumn(name = "buyer_id"),
            inverseJoinColumns = @JoinColumn(name = "seller_id")
    )
    private Set<User> followingList = new HashSet<>();

    @Override
    public String getUserType() {
        return "BUYER";
    }

    // Follow<User> from UML
    public void follow(User user) {
        if (user instanceof Seller) {
            followingList.add(user);
        }
    }

    public void unfollow(User user) {
        followingList.remove(user);
    }

    // operation1 from UML
    public String operation1(String param1) {
        return "Buyer operation1: " + param1;
    }

    // operation3 from UML
    public void operation3() {
        System.out.println("Buyer operation3 executed");
    }
}