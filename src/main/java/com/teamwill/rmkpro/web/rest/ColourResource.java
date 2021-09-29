package com.teamwill.rmkpro.web.rest;

import com.teamwill.rmkpro.domain.Colour;
import com.teamwill.rmkpro.repository.ColourRepository;
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
 * REST controller for managing {@link com.teamwill.rmkpro.domain.Colour}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ColourResource {

    private final Logger log = LoggerFactory.getLogger(ColourResource.class);

    private static final String ENTITY_NAME = "colour";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ColourRepository colourRepository;

    public ColourResource(ColourRepository colourRepository) {
        this.colourRepository = colourRepository;
    }

    /**
     * {@code POST  /colours} : Create a new colour.
     *
     * @param colour the colour to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new colour, or with status {@code 400 (Bad Request)} if the colour has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/colours")
    public ResponseEntity<Colour> createColour(@Valid @RequestBody Colour colour) throws URISyntaxException {
        log.debug("REST request to save Colour : {}", colour);
        if (colour.getId() != null) {
            throw new BadRequestAlertException("A new colour cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Colour result = colourRepository.save(colour);
        return ResponseEntity
            .created(new URI("/api/colours/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /colours/:id} : Updates an existing colour.
     *
     * @param id the id of the colour to save.
     * @param colour the colour to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated colour,
     * or with status {@code 400 (Bad Request)} if the colour is not valid,
     * or with status {@code 500 (Internal Server Error)} if the colour couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/colours/{id}")
    public ResponseEntity<Colour> updateColour(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Colour colour
    ) throws URISyntaxException {
        log.debug("REST request to update Colour : {}, {}", id, colour);
        if (colour.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, colour.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!colourRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Colour result = colourRepository.save(colour);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, colour.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /colours/:id} : Partial updates given fields of an existing colour, field will ignore if it is null
     *
     * @param id the id of the colour to save.
     * @param colour the colour to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated colour,
     * or with status {@code 400 (Bad Request)} if the colour is not valid,
     * or with status {@code 404 (Not Found)} if the colour is not found,
     * or with status {@code 500 (Internal Server Error)} if the colour couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/colours/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Colour> partialUpdateColour(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Colour colour
    ) throws URISyntaxException {
        log.debug("REST request to partial update Colour partially : {}, {}", id, colour);
        if (colour.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, colour.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!colourRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Colour> result = colourRepository
            .findById(colour.getId())
            .map(
                existingColour -> {
                    if (colour.getLabel() != null) {
                        existingColour.setLabel(colour.getLabel());
                    }
                    if (colour.getPaintType() != null) {
                        existingColour.setPaintType(colour.getPaintType());
                    }

                    return existingColour;
                }
            )
            .map(colourRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, colour.getId().toString())
        );
    }

    /**
     * {@code GET  /colours} : get all the colours.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of colours in body.
     */
    @GetMapping("/colours")
    public List<Colour> getAllColours() {
        log.debug("REST request to get all Colours");
        return colourRepository.findAll();
    }

    /**
     * {@code GET  /colours/:id} : get the "id" colour.
     *
     * @param id the id of the colour to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the colour, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/colours/{id}")
    public ResponseEntity<Colour> getColour(@PathVariable Long id) {
        log.debug("REST request to get Colour : {}", id);
        Optional<Colour> colour = colourRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(colour);
    }

    /**
     * {@code DELETE  /colours/:id} : delete the "id" colour.
     *
     * @param id the id of the colour to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/colours/{id}")
    public ResponseEntity<Void> deleteColour(@PathVariable Long id) {
        log.debug("REST request to delete Colour : {}", id);
        colourRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
