package com.upxii.watersystem.service;

import com.upxii.watersystem.dto.LeituraRequest;
import com.upxii.watersystem.dto.LeituraResponse;

import java.util.List;

public interface LeituraService {

    List<LeituraResponse> findByMedidor(Long medidorId);

    LeituraResponse create(LeituraRequest request);

    void delete(Long id);
}
