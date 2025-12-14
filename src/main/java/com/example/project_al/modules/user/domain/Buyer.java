package com.example.project_al.modules.user.domain;

import com.example.project_al.modules.catalog.domain.Product;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "buyers")
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

    // Constructors
    public Buyer() {
    }

    public Buyer(Integer userListId, String nom, String email, String phoneNumber,
                 String sharestring, String password) {
        super(userListId, nom, email, phoneNumber, sharestring, password);
    }

    // Getters and Setters
    public List<Product> getWishList() {
        return wishList;
    }

    public void setWishList(List<Product> wishList) {
        this.wishList = wishList;
    }

    public Set<User> getFollowingList() {
        return followingList;
    }

    public void setFollowingList(Set<User> followingList) {
        this.followingList = followingList;
    }

    @Override
    public String getUserType() {
        return "BUYER";
    }

    // Business methods from UML
    public void follow(User user) {
        if (user instanceof Seller) {
            followingList.add(user);
        }
    }

    public void unfollow(User user) {
        followingList.remove(user);
    }

    public void addToWishlist(Product product) {
        if (!wishList.contains(product)) {
            wishList.add(product);
        }
    }

    public void removeFromWishlist(Product product) {
        wishList.remove(product);
    }
}