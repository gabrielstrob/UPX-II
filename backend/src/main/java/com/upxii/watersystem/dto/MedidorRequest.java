package com.upxii.watersystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record MedidorRequest(
        @NotNull Long localId,
        @NotBlank @Size(max = 50) String codigoMedidor,
        @Size(max = 50) String modelo,
        LocalDate dataInstalacao
) {
}
