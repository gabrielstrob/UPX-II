package com.upxii.watersystem.service.impl;

import com.upxii.watersystem.dto.LeituraRequest;
import com.upxii.watersystem.dto.LeituraResponse;
import com.upxii.watersystem.entity.Leitura;
import com.upxii.watersystem.entity.Medidor;
import com.upxii.watersystem.exception.ResourceNotFoundException;
import com.upxii.watersystem.mapper.LeituraMapper;
import com.upxii.watersystem.repository.LeituraRepository;
import com.upxii.watersystem.repository.MedidorRepository;
import com.upxii.watersystem.service.LeituraService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeituraServiceImpl implements LeituraService {

    private final LeituraRepository leituraRepository;
    private final MedidorRepository medidorRepository;

    @Transactional(readOnly = true)
    @Override
    public List<LeituraResponse> findByMedidor(Long medidorId) {
        return leituraRepository.findByMedidorId(medidorId).stream().map(LeituraMapper::toResponse).toList();
    }

    @Override
    public LeituraResponse create(LeituraRequest request) {
        Medidor medidor = getMedidor(request.medidorId());
        Leitura leitura = Leitura.builder()
                .medidor(medidor)
                .valorLeitura(request.valorLeitura())
                .fotoLeitura(request.fotoLeitura())
                .dataLeitura(OffsetDateTime.now())
                .build();
        return LeituraMapper.toResponse(leituraRepository.save(leitura));
    }

    @Override
    public void delete(Long id) {
        Leitura leitura = leituraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leitura não encontrada"));
        leituraRepository.delete(leitura);
    }

    private Medidor getMedidor(Long id) {
        return medidorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medidor não encontrado"));
    }
}
