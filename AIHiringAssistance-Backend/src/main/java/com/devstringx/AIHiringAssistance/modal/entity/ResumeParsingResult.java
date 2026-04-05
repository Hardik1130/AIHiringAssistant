package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_parsing_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeParsingResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(columnDefinition = "TEXT")
    private String extractedSkills;

    @Column(columnDefinition = "TEXT")
    private String extractedExperience;

    @Column(columnDefinition = "TEXT")
    private String extractedEducation;

    @Column(columnDefinition = "TEXT")
    private String extractedCertifications;

    private Double confidenceScore;

    private LocalDateTime parsedAt;

    @PrePersist
    protected void onParse() {
        this.parsedAt = LocalDateTime.now();
    }
}
