package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private String jobId; // UUID

    @Column(nullable = false)
    private String title;

    private String department;

    private Integer minExperience;
    private Integer maxExperience;

    private String employmentType; // FULL_TIME, INTERN, CONTRACT

    private String location;

    @Column(columnDefinition = "TEXT")
    private String skillsRequired; // JSON / comma separated

    @Column(columnDefinition = "TEXT")
    private String jobSummary;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String qualifications;

    @Column(columnDefinition = "TEXT")
    private String aiGeneratedJd; // FINAL JD (Single Source of Truth)

    @Column(nullable = false)
    private boolean finalized = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_hr_id", nullable = false)
    private UserEntity createdBy;

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
