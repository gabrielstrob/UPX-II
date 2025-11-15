package com.upxii.watersystem.service.impl;

import com.upxii.watersystem.dto.MedidorRequest;
import com.upxii.watersystem.dto.MedidorResponse;
import com.upxii.watersystem.entity.Local;
import com.upxii.watersystem.entity.Medidor;
import com.upxii.watersystem.exception.BusinessException;
import com.upxii.watersystem.exception.ResourceNotFoundException;
import com.upxii.watersystem.mapper.MedidorMapper;
import com.upxii.watersystem.repository.LocalRepository;
import com.upxii.watersystem.repository.MedidorRepository;
import com.upxii.watersystem.service.MedidorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MedidorServiceImpl implements MedidorService {

    private final MedidorRepository medidorRepository;
    private final LocalRepository localRepository;

    @Transactional(readOnly = true)
    @Override
    public List<MedidorResponse> findAll() {
        return medidorRepository.findAll().stream().map(MedidorMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    @Override
    public List<MedidorResponse> findByLocal(Long localId) {
        return medidorRepository.findByLocalId(localId).stream().map(MedidorMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    @Override
    public MedidorResponse findById(Long id) {
        return MedidorMapper.toResponse(getMedidor(id));
    }

    @Override
    public MedidorResponse create(MedidorRequest request) {
        medidorRepository.findByCodigoMedidor(request.codigoMedidor()).ifPresent(existing -> {
            throw new BusinessException("Código de medidor já cadastrado");
        });
        Local local = getLocal(request.localId());
        Medidor medidor = Medidor.builder()
                .local(local)
                .codigoMedidor(request.codigoMedidor())
                .modelo(request.modelo())
                .dataInstalacao(request.dataInstalacao())
                .build();
        return MedidorMapper.toResponse(medidorRepository.save(medidor));
    }

    @Override
    public MedidorResponse update(Long id, MedidorRequest request) {
        Medidor medidor = getMedidor(id);
        if (!medidor.getCodigoMedidor().equals(request.codigoMedidor())) {
            medidorRepository.findByCodigoMedidor(request.codigoMedidor()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new BusinessException("Código de medidor já cadastrado");
                }
            });
        }
        Local local = getLocal(request.localId());
        medidor.setLocal(local);
        medidor.setCodigoMedidor(request.codigoMedidor());
        medidor.setModelo(request.modelo());
        medidor.setDataInstalacao(request.dataInstalacao());
        return MedidorMapper.toResponse(medidorRepository.save(medidor));
    }

    @Override
    public void delete(Long id) {
        Medidor medidor = getMedidor(id);
        medidorRepository.delete(medidor);
    }

    private Medidor getMedidor(Long id) {
        return medidorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medidor não encontrado"));
    }

    private Local getLocal(Long id) {
        return localRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Local não encontrado"));
    }
}
