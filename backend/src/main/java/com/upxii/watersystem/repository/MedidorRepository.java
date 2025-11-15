package com.upxii.watersystem.repository;

import com.upxii.watersystem.entity.Medidor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedidorRepository extends JpaRepository<Medidor, Long> {
    Optional<Medidor> findByCodigoMedidor(String codigoMedidor);
    List<Medidor> findByLocalId(Long localId);
}
