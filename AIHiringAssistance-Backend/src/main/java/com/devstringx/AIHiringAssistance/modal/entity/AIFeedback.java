package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_feedback")
public class AIFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String evaluationId;

    private boolean hrAcceptedDecision; // HR ne agree kiya?
    private boolean candidateHired;

    private String feedbackNote;

    private LocalDateTime feedbackAt;
}

