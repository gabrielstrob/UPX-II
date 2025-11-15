package com.upxii.watersystem.controller;

import com.upxii.watersystem.dto.LeituraRequest;
import com.upxii.watersystem.dto.LeituraResponse;
import com.upxii.watersystem.service.LeituraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leituras")
@RequiredArgsConstructor
public class LeituraController {

    private final LeituraService leituraService;

    @GetMapping("/medidor/{medidorId}")
    public ResponseEntity<List<LeituraResponse>> listarPorMedidor(@PathVariable Long medidorId) {
        return ResponseEntity.ok(leituraService.findByMedidor(medidorId));
    }

    @PostMapping
    public ResponseEntity<LeituraResponse> criar(@RequestBody @Valid LeituraRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leituraService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        leituraService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
