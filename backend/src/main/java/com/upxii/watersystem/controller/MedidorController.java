package com.upxii.watersystem.controller;

import com.upxii.watersystem.dto.MedidorRequest;
import com.upxii.watersystem.dto.MedidorResponse;
import com.upxii.watersystem.service.MedidorService;
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
@RequestMapping("/api/medidores")
@RequiredArgsConstructor
public class MedidorController {

    private final MedidorService medidorService;

    @GetMapping
    public ResponseEntity<List<MedidorResponse>> listar() {
        return ResponseEntity.ok(medidorService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedidorResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(medidorService.findById(id));
    }

    @GetMapping("/local/{localId}")
    public ResponseEntity<List<MedidorResponse>> listarPorLocal(@PathVariable Long localId) {
        return ResponseEntity.ok(medidorService.findByLocal(localId));
    }

    @PostMapping
    public ResponseEntity<MedidorResponse> criar(@RequestBody @Valid MedidorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(medidorService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedidorResponse> atualizar(@PathVariable Long id,
                                                     @RequestBody @Valid MedidorRequest request) {
        return ResponseEntity.ok(medidorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        medidorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
