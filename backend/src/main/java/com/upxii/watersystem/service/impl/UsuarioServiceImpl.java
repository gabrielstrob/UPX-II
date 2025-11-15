package com.upxii.watersystem.service.impl;

import com.upxii.watersystem.dto.UsuarioRequest;
import com.upxii.watersystem.dto.UsuarioResponse;
import com.upxii.watersystem.dto.UsuarioUpdateRequest;
import com.upxii.watersystem.entity.Perfil;
import com.upxii.watersystem.entity.Usuario;
import com.upxii.watersystem.exception.BusinessException;
import com.upxii.watersystem.exception.ResourceNotFoundException;
import com.upxii.watersystem.mapper.UsuarioMapper;
import com.upxii.watersystem.repository.PerfilRepository;
import com.upxii.watersystem.repository.UsuarioRepository;
import com.upxii.watersystem.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    @Override
    public List<UsuarioResponse> findAll() {
        return usuarioRepository.findAll().stream().map(UsuarioMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    @Override
    public UsuarioResponse findById(Long id) {
        return UsuarioMapper.toResponse(getUsuario(id));
    }

    @Override
    public UsuarioResponse create(UsuarioRequest request) {
        usuarioRepository.findByEmail(request.email()).ifPresent(usuario -> {
            throw new BusinessException("E-mail já cadastrado");
        });
        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .telefone(request.telefone())
                .senhaHash(passwordEncoder.encode(request.senha()))
                .criadoEm(OffsetDateTime.now())
                .perfis(resolvePerfis(request.perfis()))
                .build();
        return UsuarioMapper.toResponse(usuarioRepository.save(usuario));
    }

    @Override
    public UsuarioResponse update(Long id, UsuarioUpdateRequest request) {
        Usuario usuario = getUsuario(id);
        if (!usuario.getEmail().equals(request.email())) {
            usuarioRepository.findByEmail(request.email()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new BusinessException("E-mail já cadastrado");
                }
            });
        }
        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setTelefone(request.telefone());
        if (request.senha() != null && !request.senha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        }
        if (request.perfis() != null && !request.perfis().isEmpty()) {
            usuario.setPerfis(resolvePerfis(request.perfis()));
        }
        return UsuarioMapper.toResponse(usuarioRepository.save(usuario));
    }

    @Override
    public void delete(Long id) {
        Usuario usuario = getUsuario(id);
        usuarioRepository.delete(usuario);
    }

    private Usuario getUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private Set<Perfil> resolvePerfis(Set<String> nomesPerfis) {
        Set<String> perfisSolicitados = (nomesPerfis == null || nomesPerfis.isEmpty())
                ? Set.of("Usuario_Padrao")
                : nomesPerfis;
        Set<Perfil> perfis = new HashSet<>();
        for (String perfilNome : perfisSolicitados) {
            Perfil perfil = perfilRepository.findByNomePerfil(perfilNome)
                    .orElseThrow(() -> new BusinessException("Perfil não encontrado: " + perfilNome));
            perfis.add(perfil);
        }
        return perfis;
    }
}
