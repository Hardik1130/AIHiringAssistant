package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    private Integer totalExperience;

    private String currentRole;

    private String highestEducation;

    @Column(columnDefinition = "TEXT")
    private String skills; // JSON / comma separated

//    @Column(columnDefinition = "TEXT")
//    private String certifications;

    private String resumeFilePath;

    @Column(columnDefinition = "TEXT")
    private String resumeText;

    @Column(name = "is_soft_delete", nullable = false)
    @Builder.Default
    private Boolean isSoftDelete = false;

    private String availability;

    private String expectedCTC;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private String location;

    private String avatar;

    private Integer matchPercentage;

    @OneToMany(mappedBy = "candidateProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Education> education;

    @OneToMany(mappedBy = "candidateProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certification> certifications;

    @OneToMany(mappedBy = "candidateProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> experience;

    @ElementCollection
    @CollectionTable(
            name = "candidate_ai_insights",
            joinColumns = @JoinColumn(name = "candidate_profile_id")
    )
    @Column(name = "ai_insight", columnDefinition = "TEXT")
    private List<String> aiInsights;

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
