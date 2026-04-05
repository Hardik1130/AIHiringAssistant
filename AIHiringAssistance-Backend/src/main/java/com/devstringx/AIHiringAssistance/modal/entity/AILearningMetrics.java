package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_learning_metrics")
public class AILearningMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String modelVersion;

    private double overallAccuracy;      // %
    private double precisionScore;
    private double recallScore;

    private int totalPredictions;
    private int correctPredictions;

    private LocalDateTime lastUpdated;
}

