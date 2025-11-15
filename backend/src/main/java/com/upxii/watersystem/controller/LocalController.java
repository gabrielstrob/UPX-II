package com.upxii.watersystem.controller;

import com.upxii.watersystem.dto.LocalRequest;
import com.upxii.watersystem.dto.LocalResponse;
import com.upxii.watersystem.service.LocalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locais")
@RequiredArgsConstructor
public class LocalController {

    private final LocalService localService;

    @GetMapping
    public ResponseEntity<List<LocalResponse>> listar() {
        return ResponseEntity.ok(localService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocalResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(localService.findById(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<LocalResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(localService.findByUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<LocalResponse> criar(@RequestBody @Valid LocalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(localService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocalResponse> atualizar(@PathVariable Long id,
                                                   @RequestBody @Valid LocalRequest request) {
        return ResponseEntity.ok(localService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        localService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
