package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ai_bias_control")
public class AIBiasControl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean ignoreName;
    private boolean ignoreGender;
    private boolean ignoreCollege;
    private boolean ignoreAge;

    private String appliedAt;
}
