package com.example.incidents;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class IncidentRequestTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test void rejectsBlankTitle() {
        var request = new IncidentRequest(" ", "Description", IncidentPriority.HIGH, IncidentStatus.OPEN, "Team");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test void acceptsValidRequest() {
        var request = new IncidentRequest("API unavailable", "Gateway returns 503",
            IncidentPriority.CRITICAL, IncidentStatus.OPEN, "Platform");
        assertTrue(validator.validate(request).isEmpty());
    }
}
