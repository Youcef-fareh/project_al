package com.example.project_al.modules.stores.domain;

import com.example.project_al.modules.catalog.domain.Product;
import com.example.project_al.modules.order.domain.Order;
import com.example.project_al.modules.user.domain.Seller;
import com.example.project_al.shared.kernel.BaseEntity;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stores")
public class Store extends BaseEntity {

    @Column(name = "id_score")
    private Integer idScore;

    @Column(name = "nom_store", nullable = false)
    private String nomStore;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Post> storePosts = new ArrayList<>();

    @Column(name = "content")
    private String content;

    @Column(name = "domains")
    private String domains;

    @Column(name = "ciggote")
    private String ciggote;

    @Column(name = "grade")
    private String grade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private Seller seller;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();

    // Constructors
    public Store() {
    }

    public Store(Integer idScore, String nomStore, String content, String domains,
                 String ciggote, String grade, Seller seller) {
        this.idScore = idScore;
        this.nomStore = nomStore;
        this.content = content;
        this.domains = domains;
        this.ciggote = ciggote;
        this.grade = grade;
        this.seller = seller;
    }

    // Getters and Setters
    public Integer getIdScore() {
        return idScore;
    }

    public void setIdScore(Integer idScore) {
        this.idScore = idScore;
    }

    public String getNomStore() {
        return nomStore;
    }

    public void setNomStore(String nomStore) {
        this.nomStore = nomStore;
    }

    public List<Post> getStorePosts() {
        return storePosts;
    }

    public void setStorePosts(List<Post> storePosts) {
        this.storePosts = storePosts;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getDomains() {
        return domains;
    }

    public void setDomains(String domains) {
        this.domains = domains;
    }

    public String getCiggote() {
        return ciggote;
    }

    public void setCiggote(String ciggote) {
        this.ciggote = ciggote;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    // Business methods
    public int verifyCityPro(Product product) {
        return product != null ? 100 : 0;
    }

    public void confirm(Order order) {
        if (order != null) {
            System.out.println("Order confirmed for store: " + this.nomStore);
        }
    }

    public void operation3() {
        System.out.println("Store operation3 executed");
    }
}