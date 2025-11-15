package com.upxii.watersystem.mapper;

import com.upxii.watersystem.dto.AlertaResponse;
import com.upxii.watersystem.dto.LeituraResponse;
import com.upxii.watersystem.dto.MedidorResponse;
import com.upxii.watersystem.entity.Medidor;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public final class MedidorMapper {

    private MedidorMapper() {
    }

    public static MedidorResponse toResponse(Medidor medidor) {
        if (medidor == null) {
            return null;
        }
        List<LeituraResponse> medidorLeituras = medidor.getLeituras() == null ? Collections.emptyList()
            : medidor.getLeituras().stream().map(LeituraMapper::toResponse).collect(Collectors.toList());
        List<AlertaResponse> medidorAlertas = medidor.getAlertas() == null ? Collections.emptyList()
            : medidor.getAlertas().stream().map(AlertaMapper::toResponse).collect(Collectors.toList());
        return new MedidorResponse(
                medidor.getId(),
                medidor.getCodigoMedidor(),
                medidor.getModelo(),
                medidor.getDataInstalacao(),
                medidor.getLocal() != null ? medidor.getLocal().getId() : null,
                medidorLeituras,
                medidorAlertas
        );
    }
}
