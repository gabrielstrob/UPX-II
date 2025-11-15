package com.upxii.watersystem.security;

import com.upxii.watersystem.entity.Perfil;
import com.upxii.watersystem.entity.Usuario;
import com.upxii.watersystem.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JpaUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        return new User(usuario.getEmail(), usuario.getSenhaHash(), mapPerfis(usuario.getPerfis()));
    }

    private Collection<? extends GrantedAuthority> mapPerfis(Collection<Perfil> perfis) {
        return perfis.stream()
                .map(Perfil::getNomePerfil)
                .map(nome -> "ROLE_" + sanitize(nome))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    private String sanitize(String raw) {
        String normalized = raw == null ? "USER" : raw.trim().replaceAll("\\s+", "_");
        return normalized.toUpperCase(Locale.ROOT);
    }
}
