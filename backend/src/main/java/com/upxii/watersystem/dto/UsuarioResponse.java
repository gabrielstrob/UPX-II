package com.upxii.watersystem.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        OffsetDateTime criadoEm,
        Set<PerfilDto> perfis,
        List<LocalResponse> locais
) {
}
