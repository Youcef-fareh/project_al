package com.example.project_al.modules.order.domain;

import com.example.project_al.modules.user.domain.Buyer;
import com.example.project_al.shared.kernel.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order extends BaseEntity {

    @Column(name = "id_underlist")
    private String idUnderlist;

    @Column(name = "date_timestamp")
    private LocalDateTime dateTimestamp;

    @Column(name = "data_string", columnDefinition = "TEXT")
    private String dataString;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status = OrderStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id")
    private Buyer buyer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "billing_address")
    private String billingAddress;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "tracking_number")
    private String trackingNumber;

    // Constructors
    public Order() {
    }

    public Order(String idUnderlist, Buyer buyer, String shippingAddress,
                 String billingAddress, String paymentMethod) {
        this.idUnderlist = idUnderlist;
        this.buyer = buyer;
        this.shippingAddress = shippingAddress;
        this.billingAddress = billingAddress;
        this.paymentMethod = paymentMethod;
        this.dateTimestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getIdUnderlist() {
        return idUnderlist;
    }

    public void setIdUnderlist(String idUnderlist) {
        this.idUnderlist = idUnderlist;
    }

    public LocalDateTime getDateTimestamp() {
        return dateTimestamp;
    }

    public void setDateTimestamp(LocalDateTime dateTimestamp) {
        this.dateTimestamp = dateTimestamp;
    }

    public String getDataString() {
        return dataString;
    }

    public void setDataString(String dataString) {
        this.dataString = dataString;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Buyer getBuyer() {
        return buyer;
    }

    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    // Business Methods
    @PrePersist
    public void prePersist() {
        if (dateTimestamp == null) {
            dateTimestamp = LocalDateTime.now();
        }
    }

    public void placeOrder() {
        this.status = OrderStatus.PLACED;
        calculateTotal();
    }

    public void cancel() {
        if (this.status.canCancel()) {
            this.status = OrderStatus.CANCELLED;
            // Restore product quantities
            if (orderItems != null) {
                for (OrderItem item : orderItems) {
                    if (item != null && item.getProduct() != null && item.getQuantity() != null) {
                        try {
                            // Product should have increaseQuantity method
                            item.getProduct().increaseQuantity(item.getQuantity());
                        } catch (Exception e) {
                            System.out.println("Could not restore product quantity: " + e.getMessage());
                        }
                    }
                }
            }
        } else {
            throw new RuntimeException("Order cannot be cancelled in current status: " + status);
        }
    }

    public void pay() {
        if (this.status.canPay()) {
            this.status = OrderStatus.PROCESSING;
        } else {
            throw new RuntimeException("Order cannot be paid in current status: " + status);
        }
    }

    public void confirm() {
        if (this.status == OrderStatus.PLACED) {
            this.status = OrderStatus.CONFIRMED;
        }
    }

    public void ship(String trackingNumber) {
        if (this.status == OrderStatus.CONFIRMED) {
            this.status = OrderStatus.SHIPPED;
            this.trackingNumber = trackingNumber;
        }
    }

    public void deliver() {
        if (this.status == OrderStatus.SHIPPED) {
            this.status = OrderStatus.DELIVERED;
        }
    }

    private void calculateTotal() {
        if (orderItems != null) {
            BigDecimal total = BigDecimal.ZERO;
            for (OrderItem item : orderItems) {
                if (item != null && item.getSubtotal() != null) {
                    total = total.add(item.getSubtotal());
                }
            }
            this.totalAmount = total;
        }
    }

    public void addOrderItem(OrderItem item) {
        if (item != null) {
            item.setOrder(this);
            if (orderItems == null) {
                orderItems = new ArrayList<>();
            }
            orderItems.add(item);
            calculateTotal();
        }
    }

    public void removeOrderItem(OrderItem item) {
        if (orderItems != null && item != null) {
            orderItems.remove(item);
            item.setOrder(null);
            calculateTotal();
        }
    }

    // UML Methods
    public void order() {
        placeOrder();
    }
}