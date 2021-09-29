package com.teamwill.rmkpro.web.rest;

import com.teamwill.rmkpro.domain.Costs;
import com.teamwill.rmkpro.repository.CostsRepository;
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
 * REST controller for managing {@link com.teamwill.rmkpro.domain.Costs}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CostsResource {

    private final Logger log = LoggerFactory.getLogger(CostsResource.class);

    private static final String ENTITY_NAME = "costs";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CostsRepository costsRepository;

    public CostsResource(CostsRepository costsRepository) {
        this.costsRepository = costsRepository;
    }

    /**
     * {@code POST  /costs} : Create a new costs.
     *
     * @param costs the costs to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new costs, or with status {@code 400 (Bad Request)} if the costs has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/costs")
    public ResponseEntity<Costs> createCosts(@Valid @RequestBody Costs costs) throws URISyntaxException {
        log.debug("REST request to save Costs : {}", costs);
        if (costs.getId() != null) {
            throw new BadRequestAlertException("A new costs cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Costs result = costsRepository.save(costs);
        return ResponseEntity
            .created(new URI("/api/costs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /costs/:id} : Updates an existing costs.
     *
     * @param id the id of the costs to save.
     * @param costs the costs to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated costs,
     * or with status {@code 400 (Bad Request)} if the costs is not valid,
     * or with status {@code 500 (Internal Server Error)} if the costs couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/costs/{id}")
    public ResponseEntity<Costs> updateCosts(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Costs costs)
        throws URISyntaxException {
        log.debug("REST request to update Costs : {}, {}", id, costs);
        if (costs.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, costs.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!costsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Costs result = costsRepository.save(costs);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, costs.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /costs/:id} : Partial updates given fields of an existing costs, field will ignore if it is null
     *
     * @param id the id of the costs to save.
     * @param costs the costs to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated costs,
     * or with status {@code 400 (Bad Request)} if the costs is not valid,
     * or with status {@code 404 (Not Found)} if the costs is not found,
     * or with status {@code 500 (Internal Server Error)} if the costs couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/costs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Costs> partialUpdateCosts(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Costs costs
    ) throws URISyntaxException {
        log.debug("REST request to partial update Costs partially : {}, {}", id, costs);
        if (costs.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, costs.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!costsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Costs> result = costsRepository
            .findById(costs.getId())
            .map(
                existingCosts -> {
                    if (costs.getDetail() != null) {
                        existingCosts.setDetail(costs.getDetail());
                    }
                    if (costs.getUnitPrice() != null) {
                        existingCosts.setUnitPrice(costs.getUnitPrice());
                    }
                    if (costs.getVatAmount() != null) {
                        existingCosts.setVatAmount(costs.getVatAmount());
                    }
                    if (costs.getVatPercentage() != null) {
                        existingCosts.setVatPercentage(costs.getVatPercentage());
                    }
                    if (costs.getNetAmount() != null) {
                        existingCosts.setNetAmount(costs.getNetAmount());
                    }

                    return existingCosts;
                }
            )
            .map(costsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, costs.getId().toString())
        );
    }

    /**
     * {@code GET  /costs} : get all the costs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of costs in body.
     */
    @GetMapping("/costs")
    public List<Costs> getAllCosts() {
        log.debug("REST request to get all Costs");
        return costsRepository.findAll();
    }

    /**
     * {@code GET  /costs/:id} : get the "id" costs.
     *
     * @param id the id of the costs to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the costs, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/costs/{id}")
    public ResponseEntity<Costs> getCosts(@PathVariable Long id) {
        log.debug("REST request to get Costs : {}", id);
        Optional<Costs> costs = costsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(costs);
    }

    /**
     * {@code DELETE  /costs/:id} : delete the "id" costs.
     *
     * @param id the id of the costs to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/costs/{id}")
    public ResponseEntity<Void> deleteCosts(@PathVariable Long id) {
        log.debug("REST request to delete Costs : {}", id);
        costsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
