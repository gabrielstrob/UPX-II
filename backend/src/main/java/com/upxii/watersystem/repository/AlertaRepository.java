package com.upxii.watersystem.repository;

import com.upxii.watersystem.entity.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByMedidorId(Long medidorId);
}
