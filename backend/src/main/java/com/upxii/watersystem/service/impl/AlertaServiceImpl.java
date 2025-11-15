package com.upxii.watersystem.service.impl;

import com.upxii.watersystem.dto.AlertaRequest;
import com.upxii.watersystem.dto.AlertaResponse;
import com.upxii.watersystem.entity.Alerta;
import com.upxii.watersystem.entity.Medidor;
import com.upxii.watersystem.exception.ResourceNotFoundException;
import com.upxii.watersystem.mapper.AlertaMapper;
import com.upxii.watersystem.repository.AlertaRepository;
import com.upxii.watersystem.repository.MedidorRepository;
import com.upxii.watersystem.service.AlertaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AlertaServiceImpl implements AlertaService {

    private final AlertaRepository alertaRepository;
    private final MedidorRepository medidorRepository;

    @Transactional(readOnly = true)
    @Override
    public List<AlertaResponse> findByMedidor(Long medidorId) {
        return alertaRepository.findByMedidorId(medidorId).stream().map(AlertaMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    @Override
    public AlertaResponse findById(Long id) {
        return AlertaMapper.toResponse(getAlerta(id));
    }

    @Override
    public AlertaResponse create(AlertaRequest request) {
        Medidor medidor = getMedidor(request.medidorId());
        Alerta alerta = Alerta.builder()
                .medidor(medidor)
                .tipoAlerta(request.tipoAlerta())
                .descricao(request.descricao())
                .status(request.status())
                .dataAlerta(OffsetDateTime.now())
                .build();
        return AlertaMapper.toResponse(alertaRepository.save(alerta));
    }

    @Override
    public AlertaResponse update(Long id, AlertaRequest request) {
        Alerta alerta = getAlerta(id);
        Medidor medidor = getMedidor(request.medidorId());
        alerta.setMedidor(medidor);
        alerta.setTipoAlerta(request.tipoAlerta());
        alerta.setDescricao(request.descricao());
        alerta.setStatus(request.status());
        return AlertaMapper.toResponse(alertaRepository.save(alerta));
    }

    @Override
    public void delete(Long id) {
        Alerta alerta = getAlerta(id);
        alertaRepository.delete(alerta);
    }

    private Alerta getAlerta(Long id) {
        return alertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta não encontrado"));
    }

    private Medidor getMedidor(Long id) {
        return medidorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medidor não encontrado"));
    }
}
