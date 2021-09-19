package com.teamwill.rmkpro.web.rest;

import com.teamwill.rmkpro.domain.Make;
import com.teamwill.rmkpro.repository.MakeRepository;
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
 * REST controller for managing {@link com.teamwill.rmkpro.domain.Make}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MakeResource {

    private final Logger log = LoggerFactory.getLogger(MakeResource.class);

    private static final String ENTITY_NAME = "make";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MakeRepository makeRepository;

    public MakeResource(MakeRepository makeRepository) {
        this.makeRepository = makeRepository;
    }

    /**
     * {@code POST  /makes} : Create a new make.
     *
     * @param make the make to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new make, or with status {@code 400 (Bad Request)} if the make has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/makes")
    public ResponseEntity<Make> createMake(@Valid @RequestBody Make make) throws URISyntaxException {
        log.debug("REST request to save Make : {}", make);
        if (make.getId() != null) {
            throw new BadRequestAlertException("A new make cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Make result = makeRepository.save(make);
        return ResponseEntity
            .created(new URI("/api/makes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /makes/:id} : Updates an existing make.
     *
     * @param id the id of the make to save.
     * @param make the make to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated make,
     * or with status {@code 400 (Bad Request)} if the make is not valid,
     * or with status {@code 500 (Internal Server Error)} if the make couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/makes/{id}")
    public ResponseEntity<Make> updateMake(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Make make)
        throws URISyntaxException {
        log.debug("REST request to update Make : {}, {}", id, make);
        if (make.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, make.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!makeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Make result = makeRepository.save(make);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, make.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /makes/:id} : Partial updates given fields of an existing make, field will ignore if it is null
     *
     * @param id the id of the make to save.
     * @param make the make to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated make,
     * or with status {@code 400 (Bad Request)} if the make is not valid,
     * or with status {@code 404 (Not Found)} if the make is not found,
     * or with status {@code 500 (Internal Server Error)} if the make couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/makes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Make> partialUpdateMake(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Make make
    ) throws URISyntaxException {
        log.debug("REST request to partial update Make partially : {}, {}", id, make);
        if (make.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, make.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!makeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Make> result = makeRepository
            .findById(make.getId())
            .map(
                existingMake -> {
                    if (make.getLabel() != null) {
                        existingMake.setLabel(make.getLabel());
                    }

                    return existingMake;
                }
            )
            .map(makeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, make.getId().toString())
        );
    }

    /**
     * {@code GET  /makes} : get all the makes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of makes in body.
     */
    @GetMapping("/makes")
    public List<Make> getAllMakes() {
        log.debug("REST request to get all Makes");
        return makeRepository.findAll();
    }

    /**
     * {@code GET  /makes/:id} : get the "id" make.
     *
     * @param id the id of the make to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the make, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/makes/{id}")
    public ResponseEntity<Make> getMake(@PathVariable Long id) {
        log.debug("REST request to get Make : {}", id);
        Optional<Make> make = makeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(make);
    }

    /**
     * {@code DELETE  /makes/:id} : delete the "id" make.
     *
     * @param id the id of the make to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/makes/{id}")
    public ResponseEntity<Void> deleteMake(@PathVariable Long id) {
        log.debug("REST request to delete Make : {}", id);
        makeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
