package com.devstringx.AIHiringAssistance.service.Impl;

import com.devstringx.AIHiringAssistance.modal.request.DailyApplicantCountDTO;
import com.devstringx.AIHiringAssistance.modal.response.ApplicantFlowResponseDTO;
import com.devstringx.AIHiringAssistance.repository.JobApplicationRepository;
import com.devstringx.AIHiringAssistance.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    private final JobApplicationRepository analyticsRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // Full monthly applicant flow (used by the chart on the frontend)
    // ─────────────────────────────────────────────────────────────────────────
    @Override
    public ApplicantFlowResponseDTO getApplicantFlow(Integer month, Integer year) {

        LocalDate now = LocalDate.now();
        int targetMonth = (month != null) ? month : now.getMonthValue();
        int targetYear  = (year  != null) ? year  : now.getYear();

        log.info("Fetching applicant flow for month={} year={}", targetMonth, targetYear);

        // 1. Get today's count
        long todayCount = getTodayApplicantCount();

        // 2. Get total for the month
        long monthTotal = analyticsRepository.countApplicationsForMonth(targetMonth, targetYear);

        // 3. Get daily breakdown from DB  →  Map<day, count>
        List<Object[]> rawRows = analyticsRepository
                .getDailyApplicantCountsForMonth(targetMonth, targetYear);

        Map<Integer, Long> dayCountMap = rawRows.stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),   // day
                        row -> ((Number) row[1]).longValue()   // count
                ));

        // 4. Build a full 1–31 list (0 for days with no applications)
        //    so the frontend chart always gets a complete series
        int daysInMonth = LocalDate.of(targetYear, targetMonth, 1)
                .lengthOfMonth();

        List<DailyApplicantCountDTO> dailyFlow = new ArrayList<>();
        for (int day = 1; day <= daysInMonth; day++) {
            dailyFlow.add(DailyApplicantCountDTO.builder()
                    .day(day)
                    .count(dayCountMap.getOrDefault(day, 0L))
                    .build());
        }

        return ApplicantFlowResponseDTO.builder()
                .month(targetMonth)
                .year(targetYear)
                .todayCount(todayCount)
                .monthTotalCount(monthTotal)
                .dailyFlow(dailyFlow)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Only today's count (lightweight — used for polling / live counters)
    // ─────────────────────────────────────────────────────────────────────────
    @Override
    public long getTodayApplicantCount() {
        LocalDate today        = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();                    // 00:00:00
        LocalDateTime endOfDay   = today.atTime(LocalTime.MAX);             // 23:59:59.999
        return analyticsRepository.countApplicationsToday(startOfDay, endOfDay);
    }
}
