package com.upxii.watersystem.service;

import com.upxii.watersystem.dto.MedidorRequest;
import com.upxii.watersystem.dto.MedidorResponse;

import java.util.List;

public interface MedidorService {

    List<MedidorResponse> findAll();

    List<MedidorResponse> findByLocal(Long localId);

    MedidorResponse findById(Long id);

    MedidorResponse create(MedidorRequest request);

    MedidorResponse update(Long id, MedidorRequest request);

    void delete(Long id);
}
