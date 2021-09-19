package com.teamwill.rmkpro.web.rest;

import com.teamwill.rmkpro.domain.LegalEntityType;
import com.teamwill.rmkpro.repository.LegalEntityTypeRepository;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.teamwill.rmkpro.domain.LegalEntityType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LegalEntityTypeResource {

    private final Logger log = LoggerFactory.getLogger(LegalEntityTypeResource.class);

    private static final String ENTITY_NAME = "legalEntityType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LegalEntityTypeRepository legalEntityTypeRepository;

    public LegalEntityTypeResource(LegalEntityTypeRepository legalEntityTypeRepository) {
        this.legalEntityTypeRepository = legalEntityTypeRepository;
    }

    /**
     * {@code POST  /legal-entity-types} : Create a new legalEntityType.
     *
     * @param legalEntityType the legalEntityType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new legalEntityType, or with status {@code 400 (Bad Request)} if the legalEntityType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/legal-entity-types")
    public ResponseEntity<LegalEntityType> createLegalEntityType(@Valid @RequestBody LegalEntityType legalEntityType)
        throws URISyntaxException {
        log.debug("REST request to save LegalEntityType : {}", legalEntityType);
        if (legalEntityType.getId() != null) {
            throw new BadRequestAlertException("A new legalEntityType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LegalEntityType result = legalEntityTypeRepository.save(legalEntityType);
        return ResponseEntity
            .created(new URI("/api/legal-entity-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /legal-entity-types/:id} : Updates an existing legalEntityType.
     *
     * @param id the id of the legalEntityType to save.
     * @param legalEntityType the legalEntityType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated legalEntityType,
     * or with status {@code 400 (Bad Request)} if the legalEntityType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the legalEntityType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/legal-entity-types/{id}")
    public ResponseEntity<LegalEntityType> updateLegalEntityType(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LegalEntityType legalEntityType
    ) throws URISyntaxException {
        log.debug("REST request to update LegalEntityType : {}, {}", id, legalEntityType);
        if (legalEntityType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, legalEntityType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!legalEntityTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LegalEntityType result = legalEntityTypeRepository.save(legalEntityType);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, legalEntityType.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /legal-entity-types/:id} : Partial updates given fields of an existing legalEntityType, field will ignore if it is null
     *
     * @param id the id of the legalEntityType to save.
     * @param legalEntityType the legalEntityType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated legalEntityType,
     * or with status {@code 400 (Bad Request)} if the legalEntityType is not valid,
     * or with status {@code 404 (Not Found)} if the legalEntityType is not found,
     * or with status {@code 500 (Internal Server Error)} if the legalEntityType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/legal-entity-types/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<LegalEntityType> partialUpdateLegalEntityType(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LegalEntityType legalEntityType
    ) throws URISyntaxException {
        log.debug("REST request to partial update LegalEntityType partially : {}, {}", id, legalEntityType);
        if (legalEntityType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, legalEntityType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!legalEntityTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LegalEntityType> result = legalEntityTypeRepository
            .findById(legalEntityType.getId())
            .map(
                existingLegalEntityType -> {
                    if (legalEntityType.getLabel() != null) {
                        existingLegalEntityType.setLabel(legalEntityType.getLabel());
                    }

                    return existingLegalEntityType;
                }
            )
            .map(legalEntityTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, legalEntityType.getId().toString())
        );
    }

    /**
     * {@code GET  /legal-entity-types} : get all the legalEntityTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of legalEntityTypes in body.
     */
    @GetMapping("/legal-entity-types")
    public List<LegalEntityType> getAllLegalEntityTypes() {
        log.debug("REST request to get all LegalEntityTypes");
        return legalEntityTypeRepository.findAll();
    }

    /**
     * {@code GET  /legal-entity-types/:id} : get the "id" legalEntityType.
     *
     * @param id the id of the legalEntityType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the legalEntityType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/legal-entity-types/{id}")
    public ResponseEntity<LegalEntityType> getLegalEntityType(@PathVariable Long id) {
        log.debug("REST request to get LegalEntityType : {}", id);
        Optional<LegalEntityType> legalEntityType = legalEntityTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(legalEntityType);
    }

    /**
     * {@code DELETE  /legal-entity-types/:id} : delete the "id" legalEntityType.
     *
     * @param id the id of the legalEntityType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/legal-entity-types/{id}")
    public ResponseEntity<Void> deleteLegalEntityType(@PathVariable Long id) {
        log.debug("REST request to delete LegalEntityType : {}", id);
        legalEntityTypeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
