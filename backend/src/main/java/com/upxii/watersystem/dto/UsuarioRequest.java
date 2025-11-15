package com.upxii.watersystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record UsuarioRequest(
        @NotBlank @Size(max = 100) String nome,
        @Email @NotBlank @Size(max = 100) String email,
        @NotBlank @Size(min = 6, max = 255) String senha,
        @Size(max = 20) String telefone,
        Set<String> perfis
) {
}
