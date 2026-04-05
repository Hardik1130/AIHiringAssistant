package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ai_decision_reasons")
public class AIDecisionReason {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String evaluationId;

    private String matchedSkills;
    private String missingSkills;

    private int experienceGap; // months

    private String remarks; // Human readable reason
}

