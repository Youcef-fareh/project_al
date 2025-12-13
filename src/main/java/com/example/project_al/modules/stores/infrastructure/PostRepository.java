package com.example.project_al.modules.stores.infrastructure;

import com.example.project_al.modules.stores.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByStoreId(Long storeId);

    @Query("SELECT p FROM Post p WHERE p.store.id = :storeId AND p.dateCreation >= :startDate")
    List<Post> findRecentPostsByStore(@Param("storeId") Long storeId,
                                      @Param("startDate") LocalDateTime startDate);

    @Query("SELECT p FROM Post p WHERE p.type = :type")
    Page<Post> findByType(@Param("type") String type, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.store.seller.id = :sellerId")
    List<Post> findBySellerId(@Param("sellerId") Long sellerId);

    @Query("SELECT p FROM Post p WHERE p.postListId = :postListId")
    List<Post> findByPostListId(@Param("postListId") Integer postListId);
}