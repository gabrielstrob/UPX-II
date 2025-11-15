package com.upxii.watersystem.repository;

import com.upxii.watersystem.entity.Leitura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeituraRepository extends JpaRepository<Leitura, Long> {
    List<Leitura> findByMedidorId(Long medidorId);
}
