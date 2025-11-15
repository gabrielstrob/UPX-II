package com.upxii.watersystem.dto;

import java.time.LocalDate;
import java.util.List;

public record MedidorResponse(
        Long id,
        String codigoMedidor,
        String modelo,
        LocalDate dataInstalacao,
        Long localId,
        List<LeituraResponse> leituras,
        List<AlertaResponse> alertas
) {
}
