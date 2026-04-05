package com.devstringx.AIHiringAssistance.modal.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardResponse {
    private int totalJobs;
    private int totalUsers;
    private int totalApplicantions;
    private List<DashboardUsers> dashboardUsersList;
}
