package com.upxii.watersystem.repository;

import com.upxii.watersystem.entity.Local;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocalRepository extends JpaRepository<Local, Long> {
    List<Local> findByUsuarioId(Long usuarioId);
}
