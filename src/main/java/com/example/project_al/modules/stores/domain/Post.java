package com.example.project_al.modules.stores.domain;

import com.example.project_al.modules.stores.domain.Store;
import com.example.project_al.shared.kernel.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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