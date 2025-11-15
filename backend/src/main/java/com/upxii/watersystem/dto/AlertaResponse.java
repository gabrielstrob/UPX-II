package com.upxii.watersystem.dto;

import java.time.OffsetDateTime;

public record AlertaResponse(
        Long id,
        Long medidorId,
        String tipoAlerta,
        String descricao,
        OffsetDateTime dataAlerta,
        String status
) {
}
