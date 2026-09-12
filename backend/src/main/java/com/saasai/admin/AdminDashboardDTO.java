package com.saasai.admin;

import java.time.LocalDate;

public record AdminDashboardDTO(
    long userCount,
    long ordersCount,
    long aiUsageCount,
    long creditsConsumed,
    long revenueToday,
    long revenueMonth,
    LocalDate asOfDate
) {}