package com.upxii.watersystem.mapper;

import com.upxii.watersystem.dto.AlertaResponse;
import com.upxii.watersystem.entity.Alerta;

public final class AlertaMapper {

    private AlertaMapper() {
    }

    public static AlertaResponse toResponse(Alerta alerta) {
        if (alerta == null) {
            return null;
        }
        return new AlertaResponse(
                alerta.getId(),
                alerta.getMedidor() != null ? alerta.getMedidor().getId() : null,
                alerta.getTipoAlerta(),
                alerta.getDescricao(),
                alerta.getDataAlerta(),
                alerta.getStatus()
        );
    }
}
