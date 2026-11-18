package com.example.incidents;

import jakarta.validation.Valid;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = {"http://localhost:5173"})
public class IncidentController {
    private final IncidentRepository repository;
    public IncidentController(IncidentRepository repository) { this.repository = repository; }

    @GetMapping
    public Page<Incident> list(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) IncidentStatus status,
        @RequestParam(required = false) String search
    ) {
        if (page < 0 || size < 1 || size > 100) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pagination");
        Specification<Incident> spec = (root, query, cb) -> cb.conjunction();
        if (status != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        if (search != null && !search.isBlank()) {
            String term = "%" + search.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), term),
                cb.like(cb.lower(root.get("description")), term),
                cb.like(cb.lower(root.get("assignee")), term)));
        }
        return repository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    @GetMapping("/{id}")
    public Incident get(@PathVariable Long id) { return find(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Incident create(@Valid @RequestBody IncidentRequest request) {
        Incident item = new Incident();
        apply(item, request);
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public Incident update(@PathVariable Long id, @Valid @RequestBody IncidentRequest request) {
        Incident item = find(id);
        apply(item, request);
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { repository.delete(find(id)); }

    private Incident find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident not found"));
    }
    private void apply(Incident item, IncidentRequest r) {
        item.setTitle(r.title().trim());
        item.setDescription(r.description().trim());
        item.setPriority(r.priority());
        item.setStatus(r.status());
        item.setAssignee(r.assignee() == null ? "" : r.assignee().trim());
    }
}
