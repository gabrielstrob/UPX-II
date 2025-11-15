package com.upxii.watersystem.service;

import com.upxii.watersystem.dto.AlertaRequest;
import com.upxii.watersystem.dto.AlertaResponse;

import java.util.List;

public interface AlertaService {

    List<AlertaResponse> findByMedidor(Long medidorId);

    AlertaResponse findById(Long id);

    AlertaResponse create(AlertaRequest request);

    AlertaResponse update(Long id, AlertaRequest request);

    void delete(Long id);
}
