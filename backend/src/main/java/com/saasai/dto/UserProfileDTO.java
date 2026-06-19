package com.saasai.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {
    private Long id;
    private String email;
    private String fullName;
    private String agency;
    private String role;
    private Double creditBalance;
    private String packageType;
    private LocalDateTime expireDate;
    private AffiliateDTO affiliate;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AffiliateDTO {
        private String code;
        private String link;
        private Double totalEarnings;
    }
}
