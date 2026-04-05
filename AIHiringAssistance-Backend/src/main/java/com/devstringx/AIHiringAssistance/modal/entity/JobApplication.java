package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications",
        uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "candidate_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String applicationId; // UUID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private JobEntity job;

    @Column(name = "user_id", nullable = false)
    private String userId;

    private String status;
    // APPLIED, SHORTLISTED, REJECTED

    private LocalDateTime appliedAt;

    @PrePersist
    protected void onApply() {
        this.appliedAt = LocalDateTime.now();
    }
}
