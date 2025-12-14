package com.example.project_al.modules.user.infrastructure;

import com.example.project_al.modules.user.application.AuthService;
import com.example.project_al.modules.user.application.UserService;
import com.example.project_al.modules.user.domain.Buyer;
import com.example.project_al.modules.user.domain.Seller;
import com.example.project_al.modules.user.domain.User;
import com.example.project_al.shared.kernel.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users, buyers, and sellers")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @Autowired
    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register/buyer")
    @Operation(summary = "Register a new buyer")
    public ResponseEntity<ApiResponse<Buyer>> registerBuyer(@Valid @RequestBody Buyer buyer) {
        Buyer registered = (Buyer) userService.registerUser(buyer);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(registered, "Buyer registered successfully"));
    }

    @PostMapping("/register/seller")
    @Operation(summary = "Register a new seller")
    public ResponseEntity<ApiResponse<Seller>> registerSeller(@Valid @RequestBody Seller seller) {
        Seller registered = (Seller) userService.registerUser(seller);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(registered, "Seller registered successfully"));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
            @RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, Object> authResponse = authService.authenticate(email, password);
        return ResponseEntity.ok(ApiResponse.success(authResponse, "Login successful"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> ResponseEntity.ok(ApiResponse.success(user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found")));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get user by email")
    public ResponseEntity<ApiResponse<User>> getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(user -> ResponseEntity.ok(ApiResponse.success(user)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found")));
    }

    @GetMapping("/buyers")
    @Operation(summary = "Get all buyers")
    public ResponseEntity<ApiResponse<List<Buyer>>> getAllBuyers() {
        List<Buyer> buyers = userService.getAllBuyers();
        return ResponseEntity.ok(ApiResponse.success(buyers));
    }

    @GetMapping("/sellers")
    @Operation(summary = "Get all sellers")
    public ResponseEntity<ApiResponse<List<Seller>>> getAllSellers() {
        List<Seller> sellers = userService.getAllSellers();
        return ResponseEntity.ok(ApiResponse.success(sellers));
    }

    @PostMapping("/{buyerId}/follow/{sellerId}")
    @Operation(summary = "Buyer follows a seller")
    public ResponseEntity<ApiResponse<String>> followSeller(
            @PathVariable Long buyerId,
            @PathVariable Long sellerId) {
        userService.followSeller(buyerId, sellerId);
        return ResponseEntity.ok(ApiResponse.success("Successfully followed seller"));
    }

    @DeleteMapping("/{buyerId}/unfollow/{sellerId}")
    @Operation(summary = "Buyer unfollows a seller")
    public ResponseEntity<ApiResponse<String>> unfollowSeller(
            @PathVariable Long buyerId,
            @PathVariable Long sellerId) {
        userService.unfollowSeller(buyerId, sellerId);
        return ResponseEntity.ok(ApiResponse.success("Successfully unfollowed seller"));
    }

    @GetMapping("/sellers/{sellerId}/followers")
    @Operation(summary = "Get all followers of a seller")
    public ResponseEntity<ApiResponse<List<Buyer>>> getSellerFollowers(@PathVariable Long sellerId) {
        List<Buyer> followers = userService.getFollowers(sellerId);
        return ResponseEntity.ok(ApiResponse.success(followers));
    }

    @GetMapping("/sellers/{sellerId}/followers/count")
    @Operation(summary = "Count followers of a seller")
    public ResponseEntity<ApiResponse<Long>> countSellerFollowers(@PathVariable Long sellerId) {
        Long count = userService.countFollowers(sellerId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "User updated successfully"));
    }

    @GetMapping("/search")
    @Operation(summary = "Search users by name")
    public ResponseEntity<ApiResponse<Page<User>>> searchUsers(
            @RequestParam String keyword,
            @Parameter(hidden = true) Pageable pageable) {
        Page<User> users = userService.searchUsers(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate user")
    public ResponseEntity<ApiResponse<String>> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully"));
    }

    @PutMapping("/{id}/activate")
    @Operation(summary = "Activate user")
    public ResponseEntity<ApiResponse<String>> activateUser(@PathVariable Long id) {
        userService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User activated successfully"));
    }

    @GetMapping("/list-id/{userListId}")
    @Operation(summary = "Get users by user list ID")
    public ResponseEntity<ApiResponse<List<User>>> getUsersByListId(@PathVariable Integer userListId) {
        List<User> users = userService.findByUserListId(userListId);
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}