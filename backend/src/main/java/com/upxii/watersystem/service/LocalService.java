package com.upxii.watersystem.service;

import com.upxii.watersystem.dto.LocalRequest;
import com.upxii.watersystem.dto.LocalResponse;

import java.util.List;

public interface LocalService {

    List<LocalResponse> findAll();

    LocalResponse findById(Long id);

    List<LocalResponse> findByUsuario(Long usuarioId);

    LocalResponse create(LocalRequest request);

    LocalResponse update(Long id, LocalRequest request);

    void delete(Long id);
}
