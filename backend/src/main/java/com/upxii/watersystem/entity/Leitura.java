package com.upxii.watersystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "leituras")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Leitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medidor_id", nullable = false)
    private Medidor medidor;

    @Column(name = "data_leitura")
    private OffsetDateTime dataLeitura;

    @Column(name = "valor_leitura", nullable = false, precision = 10, scale = 3)
    private BigDecimal valorLeitura;

    @Column(name = "foto_leitura", length = 255)
    private String fotoLeitura;
}
