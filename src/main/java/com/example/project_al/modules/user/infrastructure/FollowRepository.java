package com.example.project_al.modules.user.infrastructure;

import com.example.project_al.modules.user.domain.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByBuyerIdAndSellerId(Long buyerId, Long sellerId);

    boolean existsByBuyerIdAndSellerId(Long buyerId, Long sellerId);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.seller.id = :sellerId")
    Long countBySellerId(@Param("sellerId") Long sellerId);

    @Query("SELECT f FROM Follow f WHERE f.buyer.id = :buyerId")
    List<Follow> findByBuyerId(@Param("buyerId") Long buyerId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Follow f WHERE f.buyer.id = :buyerId AND f.seller.id = :sellerId")
    void deleteByBuyerIdAndSellerId(@Param("buyerId") Long buyerId, @Param("sellerId") Long sellerId);

    @Query("SELECT f FROM Follow f WHERE f.seller.id = :sellerId")
    List<Follow> findBySellerId(@Param("sellerId") Long sellerId);
}