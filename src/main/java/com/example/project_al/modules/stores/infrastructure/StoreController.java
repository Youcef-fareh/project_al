package com.example.project_al.modules.stores.infrastructure;

import com.example.project_al.modules.stores.application.StoreService;
import com.example.project_al.modules.stores.domain.Post;
import com.example.project_al.modules.stores.domain.Store;
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

@RestController
@RequestMapping("/api/stores")
@Tag(name = "Store Management", description = "APIs for managing stores and posts")
public class StoreController {

    private final StoreService storeService;

    // Constructor with @Autowired
    @Autowired
    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @PostMapping
    @Operation(summary = "Create a new store")
    public ResponseEntity<ApiResponse<Store>> createStore(@Valid @RequestBody Store store) {
        Store created = storeService.createStore(store);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Store created successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get store by ID")
    public ResponseEntity<ApiResponse<Store>> getStore(@PathVariable Long id) {
        return storeService.findById(id)
                .map(store -> ResponseEntity.ok(ApiResponse.success(store)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Store not found")));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update store")
    public ResponseEntity<ApiResponse<Store>> updateStore(
            @PathVariable Long id,
            @Valid @RequestBody Store storeDetails) {
        Store updated = storeService.updateStore(id, storeDetails);
        return ResponseEntity.ok(ApiResponse.success(updated, "Store updated successfully"));
    }

    @GetMapping("/seller/{sellerId}")
    @Operation(summary = "Get stores by seller ID")
    public ResponseEntity<ApiResponse<List<Store>>> getStoresBySeller(@PathVariable Long sellerId) {
        List<Store> stores = storeService.findBySellerId(sellerId);
        return ResponseEntity.ok(ApiResponse.success(stores));
    }

    @GetMapping("/search")
    @Operation(summary = "Search stores by name")
    public ResponseEntity<ApiResponse<Page<Store>>> searchStores(
            @RequestParam String keyword,
            @Parameter(hidden = true) Pageable pageable) {
        Page<Store> stores = storeService.searchStores(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(stores));
    }

    @GetMapping("/high-score")
    @Operation(summary = "Get high score stores")
    public ResponseEntity<ApiResponse<List<Store>>> getHighScoreStores(
            @RequestParam(defaultValue = "80") Integer minScore) {
        List<Store> stores = storeService.findHighScoreStores(minScore);
        return ResponseEntity.ok(ApiResponse.success(stores));
    }

    @GetMapping("/grade/{grade}")
    @Operation(summary = "Get stores by grade")
    public ResponseEntity<ApiResponse<List<Store>>> getStoresByGrade(@PathVariable String grade) {
        List<Store> stores = storeService.findByGrade(grade);
        return ResponseEntity.ok(ApiResponse.success(stores));
    }

    @PostMapping("/{storeId}/posts")
    @Operation(summary = "Create a post for a store")
    public ResponseEntity<ApiResponse<Post>> createPost(
            @PathVariable Long storeId,
            @Valid @RequestBody Post post) {
        Store store = storeService.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        // Set the store on the post
        post.setStore(store);

        Post created = storeService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Post created successfully"));
    }

    @GetMapping("/{storeId}/posts")
    @Operation(summary = "Get all posts for a store")
    public ResponseEntity<ApiResponse<List<Post>>> getStorePosts(@PathVariable Long storeId) {
        List<Post> posts = storeService.getStorePosts(storeId);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete store (soft delete)")
    public ResponseEntity<ApiResponse<String>> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.ok(ApiResponse.success("Store deleted successfully"));
    }
}