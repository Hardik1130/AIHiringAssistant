package com.devstringx.AIHiringAssistance.modal.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "experience")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String period;

    @ManyToOne
    @JoinColumn(name = "candidate_profile_id")
    @JsonIgnore
    private CandidateProfile candidateProfile;

    @ElementCollection
    @CollectionTable(
            name = "experience_description",
            joinColumns = @JoinColumn(name = "experience_id")
    )
    @Column(name = "description", columnDefinition = "TEXT")
    private List<String> description;
}
