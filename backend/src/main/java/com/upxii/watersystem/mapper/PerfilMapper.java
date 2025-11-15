package com.upxii.watersystem.mapper;

import com.upxii.watersystem.dto.PerfilDto;
import com.upxii.watersystem.entity.Perfil;

public final class PerfilMapper {

    private PerfilMapper() {
    }

    public static PerfilDto toDto(Perfil perfil) {
        if (perfil == null) {
            return null;
        }
        return new PerfilDto(perfil.getId(), perfil.getNomePerfil());
    }
}
