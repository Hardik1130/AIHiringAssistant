package com.devstringx.AIHiringAssistance.modal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.Setter;

@Entity
@Table(name = "education")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String degree;
    private String institution;
    private String period;

    @ManyToOne
    @JoinColumn(name = "candidate_profile_id")
    @JsonIgnore
    private CandidateProfile candidateProfile;
}
