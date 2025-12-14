package com.example.project_al.modules.user.domain;

import com.example.project_al.shared.kernel.BaseEntity;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
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

    // Constructors
    public User() {
    }

    public User(Integer userListId, String nom, String email, String phoneNumber,
                String sharestring, String password) {
        this.userListId = userListId;
        this.nom = nom;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.sharestring = sharestring;
        this.password = password;
    }

    // Getters and Setters
    public Integer getUserListId() {
        return userListId;
    }

    public void setUserListId(Integer userListId) {
        this.userListId = userListId;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSharestring() {
        return sharestring;
    }

    public void setSharestring(String sharestring) {
        this.sharestring = sharestring;
    }

    public List<String> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<String> addresses) {
        this.addresses = addresses;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Abstract methods
    public abstract String getUserType();

    // Business methods from UML
    public boolean signIn(String password) {
        return this.password.equals(password);
    }

    public String operation1(String param1) {
        return "Operation1 result for " + param1;
    }

    public void operation2(String param1) {
        System.out.println("Operation2 executed with param: " + param1);
    }

    public void operation3() {
        System.out.println("Operation3 executed");
    }
}