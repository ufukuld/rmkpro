package com.teamwill.rmkpro.web.rest;

import com.teamwill.rmkpro.domain.Trim;
import com.teamwill.rmkpro.repository.TrimRepository;
import com.teamwill.rmkpro.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.teamwill.rmkpro.domain.Trim}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TrimResource {

    private final Logger log = LoggerFactory.getLogger(TrimResource.class);

    private static final String ENTITY_NAME = "trim";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private TrimRepository trimRepository;

    /**
     * {@code POST  /trims} : Create a new trim.
     *
     * @param trim the trim to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new trim, or with status {@code 400 (Bad Request)} if the trim has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/trims")
    public ResponseEntity<Trim> createTrim(@Valid @RequestBody Trim trim) throws URISyntaxException {
        log.debug("REST request to save Trim : {}", trim);
        if (trim.getId() != null) {
            throw new BadRequestAlertException("A new trim cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Trim result = trimRepository.save(trim);
        return ResponseEntity
            .created(new URI("/api/trims/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /trims/:id} : Updates an existing trim.
     *
     * @param id the id of the trim to save.
     * @param trim the trim to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trim,
     * or with status {@code 400 (Bad Request)} if the trim is not valid,
     * or with status {@code 500 (Internal Server Error)} if the trim couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/trims/{id}")
    public ResponseEntity<Trim> updateTrim(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Trim trim)
        throws URISyntaxException {
        log.debug("REST request to update Trim : {}, {}", id, trim);
        if (trim.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trim.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trimRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Trim result = trimRepository.save(trim);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, trim.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /trims/:id} : Partial updates given fields of an existing trim, field will ignore if it is null
     *
     * @param id the id of the trim to save.
     * @param trim the trim to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trim,
     * or with status {@code 400 (Bad Request)} if the trim is not valid,
     * or with status {@code 404 (Not Found)} if the trim is not found,
     * or with status {@code 500 (Internal Server Error)} if the trim couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/trims/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Trim> partialUpdateTrim(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Trim trim
    ) throws URISyntaxException {
        log.debug("REST request to partial update Trim partially : {}, {}", id, trim);
        if (trim.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trim.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trimRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Trim> result = trimRepository
            .findById(trim.getId())
            .map(
                existingTrim -> {
                    if (trim.getLabel() != null) {
                        existingTrim.setLabel(trim.getLabel());
                    }
                    if (trim.getDoors() != null) {
                        existingTrim.setDoors(trim.getDoors());
                    }
                    if (trim.getSeats() != null) {
                        existingTrim.setSeats(trim.getSeats());
                    }
                    if (trim.getEngineDisplacementCc() != null) {
                        existingTrim.setEngineDisplacementCc(trim.getEngineDisplacementCc());
                    }
                    if (trim.getIsAutomatic() != null) {
                        existingTrim.setIsAutomatic(trim.getIsAutomatic());
                    }
                    if (trim.getFuelType() != null) {
                        existingTrim.setFuelType(trim.getFuelType());
                    }

                    return existingTrim;
                }
            )
            .map(trimRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, trim.getId().toString())
        );
    }

    /**
     * {@code GET  /trims} : get all the trims.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of trims in body.
     */
    @GetMapping("/trims")
    public List<Trim> getAllTrims() {
        log.debug("REST request to get all Trims");
        //return trimRepository.findAll().stream().map(referenceMapper::toDto).collect(Collectors.toList());
        return trimRepository.listWithModelAndMake();
    }

    /**
     * {@code GET  /trims/:id} : get the "id" trim.
     *
     * @param id the id of the trim to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the trim, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trims/{id}")
    public ResponseEntity<Trim> getTrim(@PathVariable Long id) {
        log.debug("REST request to get Trim : {}", id);
        Optional<Trim> trim = trimRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(trim);
    }

    /**
     * {@code DELETE  /trims/:id} : delete the "id" trim.
     *
     * @param id the id of the trim to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/trims/{id}")
    public ResponseEntity<Void> deleteTrim(@PathVariable Long id) {
        log.debug("REST request to delete Trim : {}", id);
        trimRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
