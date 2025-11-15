package com.upxii.watersystem.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record LeituraResponse(
        Long id,
        Long medidorId,
        OffsetDateTime dataLeitura,
        BigDecimal valorLeitura,
        String fotoLeitura
) {
}
