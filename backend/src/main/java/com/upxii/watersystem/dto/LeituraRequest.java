package com.upxii.watersystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record LeituraRequest(
        @NotNull Long medidorId,
        @NotNull @Positive BigDecimal valorLeitura,
        @Size(max = 255) String fotoLeitura
) {
}
