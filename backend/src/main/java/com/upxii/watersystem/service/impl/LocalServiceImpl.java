package com.upxii.watersystem.service.impl;

import com.upxii.watersystem.dto.LocalRequest;
import com.upxii.watersystem.dto.LocalResponse;
import com.upxii.watersystem.entity.Local;
import com.upxii.watersystem.entity.Usuario;
import com.upxii.watersystem.exception.ResourceNotFoundException;
import com.upxii.watersystem.mapper.LocalMapper;
import com.upxii.watersystem.repository.LocalRepository;
import com.upxii.watersystem.repository.UsuarioRepository;
import com.upxii.watersystem.service.LocalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LocalServiceImpl implements LocalService {

    private final LocalRepository localRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    @Override
    public List<LocalResponse> findAll() {
        return localRepository.findAll().stream().map(LocalMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    @Override
    public LocalResponse findById(Long id) {
        return LocalMapper.toResponse(getLocal(id));
    }

    @Transactional(readOnly = true)
    @Override
    public List<LocalResponse> findByUsuario(Long usuarioId) {
        return localRepository.findByUsuarioId(usuarioId).stream().map(LocalMapper::toResponse).toList();
    }

    @Override
    public LocalResponse create(LocalRequest request) {
        Usuario usuario = getUsuario(request.usuarioId());
        Local local = Local.builder()
                .nomeLocal(request.nomeLocal())
                .endereco(request.endereco())
                .cep(request.cep())
                .usuario(usuario)
                .build();
        return LocalMapper.toResponse(localRepository.save(local));
    }

    @Override
    public LocalResponse update(Long id, LocalRequest request) {
        Local local = getLocal(id);
        Usuario usuario = getUsuario(request.usuarioId());
        local.setNomeLocal(request.nomeLocal());
        local.setEndereco(request.endereco());
        local.setCep(request.cep());
        local.setUsuario(usuario);
        return LocalMapper.toResponse(localRepository.save(local));
    }

    @Override
    public void delete(Long id) {
        Local local = getLocal(id);
        localRepository.delete(local);
    }

    private Local getLocal(Long id) {
        return localRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Local não encontrado"));
    }

    private Usuario getUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }
}
