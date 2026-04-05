package com.devstringx.AIHiringAssistance.modal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rule_engine")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RuleEngine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rule_name", nullable = false)
    private String ruleName;

    // ❗ FIXED: reserved keyword
    @Column(name = "rule_condition", nullable = false)
    private String condition;   // experience < 2

    @Column(name = "action", nullable = false)
    private String action;      // REJECT / SHORTLIST

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}

