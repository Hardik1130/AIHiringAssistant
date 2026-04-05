package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_evaluations")
public class AIEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String evaluationId; // UUID

    private String jdId;
    private String candidateId;

    private double jdMatchScore;       // 0–100
    private double skillMatchScore;
    private double experienceScore;

    private double aiConfidence;        // AI khud kitna sure hai

    private boolean ruleBasedUsed;      // fallback laga ya nahi

    private String decision;            // SHORTLIST / REJECT

    private LocalDateTime evaluatedAt;
}

