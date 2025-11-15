package com.upxii.watersystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "medidores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medidor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "local_id", nullable = false)
    private Local local;

    @Column(name = "codigo_medidor", nullable = false, unique = true, length = 50)
    private String codigoMedidor;

    @Column(length = 50)
    private String modelo;

    @Column(name = "data_instalacao")
    private LocalDate dataInstalacao;

    @OneToMany(mappedBy = "medidor")
    private List<Leitura> leituras;

    @OneToMany(mappedBy = "medidor")
    private List<Alerta> alertas;
}
