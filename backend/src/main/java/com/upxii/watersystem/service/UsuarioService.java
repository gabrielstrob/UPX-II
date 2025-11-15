package com.upxii.watersystem.service;

import com.upxii.watersystem.dto.UsuarioRequest;
import com.upxii.watersystem.dto.UsuarioResponse;
import com.upxii.watersystem.dto.UsuarioUpdateRequest;

import java.util.List;

public interface UsuarioService {

    List<UsuarioResponse> findAll();

    UsuarioResponse findById(Long id);

    UsuarioResponse create(UsuarioRequest request);

    UsuarioResponse update(Long id, UsuarioUpdateRequest request);

    void delete(Long id);
}
