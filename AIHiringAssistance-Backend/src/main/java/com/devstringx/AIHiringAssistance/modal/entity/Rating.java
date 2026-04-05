package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_ratings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private UserEntity candidate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rated_by_hr_id", nullable = false)
    private UserEntity ratedBy;

    @Column(nullable = false)
    private Integer rating; // 1 to 5 (ya 1 to 10 – tum decide karo)

    @Column(length = 500)
    private String feedback;

    @Column(nullable = false)
    private String skill;
    // Example: "Java", "Spring Boot", "Communication"

    private boolean active = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
