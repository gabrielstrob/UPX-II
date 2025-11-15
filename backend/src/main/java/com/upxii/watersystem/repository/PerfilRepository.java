package com.upxii.watersystem.repository;

import com.upxii.watersystem.entity.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerfilRepository extends JpaRepository<Perfil, Long> {
    Optional<Perfil> findByNomePerfil(String nomePerfil);
}
