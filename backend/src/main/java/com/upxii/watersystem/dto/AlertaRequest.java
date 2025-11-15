package com.upxii.watersystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AlertaRequest(
        @NotNull Long medidorId,
        @NotBlank @Size(max = 50) String tipoAlerta,
        String descricao,
        @Size(max = 20) String status
) {
}
