package com.devstringx.AIHiringAssistance.modal.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "certifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String issuer;
    private String date;

    @ManyToOne
    @JoinColumn(name = "candidate_profile_id")
    @JsonIgnore
    private CandidateProfile candidateProfile;
}
