package com.example.project_al.modules.user.domain;

import com.example.project_al.shared.kernel.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class User extends BaseEntity {

    @Column(name = "user_list_id", unique = true)
    private Integer userListId;

    @Column(nullable = false)
    private String nom;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "sharestring")
    private String sharestring;

    @ElementCollection
    @CollectionTable(name = "user_addresses", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "address")
    private List<String> addresses = new ArrayList<>();

    @Column(nullable = false)
    private String password;

    public abstract String getUserType();

    public boolean signIn(String password) {
        return this.password.equals(password);
    }

    // Operation1 from UML
    public String operation1(String param1) {
        return "Operation1 result for " + param1;
    }

    // Operation2 from UML
    public void operation2(String param1) {
        System.out.println("Operation2 executed with param: " + param1);
    }

    // Operation3 from UML
    public void operation3() {
        System.out.println("Operation3 executed");
    }
}