package com.upxii.watersystem.mapper;

import com.upxii.watersystem.dto.LocalResponse;
import com.upxii.watersystem.dto.MedidorResponse;
import com.upxii.watersystem.entity.Local;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public final class LocalMapper {

    private LocalMapper() {
    }

    public static LocalResponse toResponse(Local local) {
        if (local == null) {
            return null;
        }
        List<MedidorResponse> medidores = local.getMedidores() == null ? Collections.emptyList()
                : local.getMedidores().stream().map(MedidorMapper::toResponse).collect(Collectors.toList());
        return new LocalResponse(
                local.getId(),
                local.getNomeLocal(),
                local.getEndereco(),
                local.getCep(),
                local.getUsuario() != null ? local.getUsuario().getId() : null,
                medidores
        );
    }
}
