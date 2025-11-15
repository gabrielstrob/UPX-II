package com.upxii.watersystem.dto;

import java.util.List;

public record LocalResponse(
        Long id,
        String nomeLocal,
        String endereco,
        String cep,
        Long usuarioId,
        List<MedidorResponse> medidores
) {
}
