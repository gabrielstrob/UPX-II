package com.upxii.watersystem.exception;

import java.time.OffsetDateTime;
import java.util.Map;

public record ErrorResponse(
        String message,
        OffsetDateTime timestamp,
        Map<String, String> details
) {
}
