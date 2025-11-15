package com.upxii.watersystem.mapper;

import com.upxii.watersystem.dto.LeituraResponse;
import com.upxii.watersystem.entity.Leitura;

public final class LeituraMapper {

    private LeituraMapper() {
    }

    public static LeituraResponse toResponse(Leitura leitura) {
        if (leitura == null) {
            return null;
        }
        return new LeituraResponse(
                leitura.getId(),
                leitura.getMedidor() != null ? leitura.getMedidor().getId() : null,
                leitura.getDataLeitura(),
                leitura.getValorLeitura(),
                leitura.getFotoLeitura()
        );
    }
}
