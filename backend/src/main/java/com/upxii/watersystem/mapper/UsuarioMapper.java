package com.upxii.watersystem.mapper;

import com.upxii.watersystem.dto.LocalResponse;
import com.upxii.watersystem.dto.PerfilDto;
import com.upxii.watersystem.dto.UsuarioResponse;
import com.upxii.watersystem.entity.Usuario;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class UsuarioMapper {

    private UsuarioMapper() {
    }

    public static UsuarioResponse toResponse(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        Set<PerfilDto> perfis = usuario.getPerfis() == null ? Collections.emptySet()
                : usuario.getPerfis().stream().map(PerfilMapper::toDto).collect(Collectors.toSet());
        List<LocalResponse> locais = usuario.getLocais() == null ? Collections.emptyList()
                : usuario.getLocais().stream().map(LocalMapper::toResponse).collect(Collectors.toList());
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getCriadoEm(),
                perfis,
                locais
        );
    }
}
