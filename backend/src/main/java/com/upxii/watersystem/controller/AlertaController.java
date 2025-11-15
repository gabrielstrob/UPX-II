package com.upxii.watersystem.controller;

import com.upxii.watersystem.dto.AlertaRequest;
import com.upxii.watersystem.dto.AlertaResponse;
import com.upxii.watersystem.service.AlertaService;
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
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final AlertaService alertaService;

    @GetMapping("/medidor/{medidorId}")
    public ResponseEntity<List<AlertaResponse>> listarPorMedidor(@PathVariable Long medidorId) {
        return ResponseEntity.ok(alertaService.findByMedidor(medidorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlertaResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<AlertaResponse> criar(@RequestBody @Valid AlertaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(alertaService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlertaResponse> atualizar(@PathVariable Long id,
                                                    @RequestBody @Valid AlertaRequest request) {
        return ResponseEntity.ok(alertaService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        alertaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
