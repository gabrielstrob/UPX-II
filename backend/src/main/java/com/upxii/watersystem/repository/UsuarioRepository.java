package com.upxii.watersystem.repository;

import com.upxii.watersystem.entity.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    @EntityGraph(attributePaths = {"perfis"})
    Optional<Usuario> findByEmail(String email);
}
