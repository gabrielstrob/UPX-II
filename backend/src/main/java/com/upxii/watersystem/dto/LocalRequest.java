package com.upxii.watersystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LocalRequest(
        @NotNull Long usuarioId,
        @NotBlank @Size(max = 100) String nomeLocal,
        @Size(max = 255) String endereco,
        @Size(max = 10) String cep
) {
}
