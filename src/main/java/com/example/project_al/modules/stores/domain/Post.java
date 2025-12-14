package com.example.project_al.modules.stores.domain;

import com.example.project_al.shared.kernel.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
public class Post extends BaseEntity {

    @Column(name = "post_list_id")
    private Integer postListId;

    @Column(name = "nom_post")
    private String nomPost;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "type")
    private String type;

    @ElementCollection
    @CollectionTable(name = "post_mod_class", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "mod_class")
    private List<String> modClassList = new ArrayList<>();

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    // Constructors
    public Post() {
    }

    public Post(Integer postListId, String nomPost, LocalDateTime dateCreation,
                String type, String description, Store store) {
        this.postListId = postListId;
        this.nomPost = nomPost;
        this.dateCreation = dateCreation;
        this.type = type;
        this.description = description;
        this.store = store;
    }

    // Getters and Setters
    public Integer getPostListId() {
        return postListId;
    }

    public void setPostListId(Integer postListId) {
        this.postListId = postListId;
    }

    public String getNomPost() {
        return nomPost;
    }

    public void setNomPost(String nomPost) {
        this.nomPost = nomPost;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<String> getModClassList() {
        return modClassList;
    }

    public void setModClassList(List<String> modClassList) {
        this.modClassList = modClassList;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    // Business methods from UML
    public String operation1(String params1) {
        return "Post operation1: " + params1;
    }

    public void operation2(String params1) {
        System.out.println("Post operation2 with param: " + params1);
    }

    public void operation3() {
        System.out.println("Post operation3 executed");
    }
}