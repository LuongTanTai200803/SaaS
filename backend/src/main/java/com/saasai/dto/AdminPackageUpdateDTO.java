package com.saasai.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminPackageUpdateDTO {
    private Long price;
    private Double creditLimit;
    private List<String> allowedModels;
}
