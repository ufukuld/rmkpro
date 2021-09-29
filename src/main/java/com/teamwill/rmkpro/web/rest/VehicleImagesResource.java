package com.teamwill.rmkpro.web.rest;

import com.teamwill.rmkpro.domain.VehicleImages;
import com.teamwill.rmkpro.repository.VehicleImagesRepository;
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
 * REST controller for managing {@link com.teamwill.rmkpro.domain.VehicleImages}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VehicleImagesResource {

    private final Logger log = LoggerFactory.getLogger(VehicleImagesResource.class);

    private static final String ENTITY_NAME = "vehicleImages";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VehicleImagesRepository vehicleImagesRepository;

    public VehicleImagesResource(VehicleImagesRepository vehicleImagesRepository) {
        this.vehicleImagesRepository = vehicleImagesRepository;
    }

    /**
     * {@code POST  /vehicle-images} : Create a new vehicleImages.
     *
     * @param vehicleImages the vehicleImages to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vehicleImages, or with status {@code 400 (Bad Request)} if the vehicleImages has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vehicle-images")
    public ResponseEntity<VehicleImages> createVehicleImages(@Valid @RequestBody VehicleImages vehicleImages) throws URISyntaxException {
        log.debug("REST request to save VehicleImages : {}", vehicleImages);
        if (vehicleImages.getId() != null) {
            throw new BadRequestAlertException("A new vehicleImages cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VehicleImages result = vehicleImagesRepository.save(vehicleImages);
        return ResponseEntity
            .created(new URI("/api/vehicle-images/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vehicle-images/:id} : Updates an existing vehicleImages.
     *
     * @param id the id of the vehicleImages to save.
     * @param vehicleImages the vehicleImages to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vehicleImages,
     * or with status {@code 400 (Bad Request)} if the vehicleImages is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vehicleImages couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vehicle-images/{id}")
    public ResponseEntity<VehicleImages> updateVehicleImages(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody VehicleImages vehicleImages
    ) throws URISyntaxException {
        log.debug("REST request to update VehicleImages : {}, {}", id, vehicleImages);
        if (vehicleImages.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vehicleImages.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vehicleImagesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VehicleImages result = vehicleImagesRepository.save(vehicleImages);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vehicleImages.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vehicle-images/:id} : Partial updates given fields of an existing vehicleImages, field will ignore if it is null
     *
     * @param id the id of the vehicleImages to save.
     * @param vehicleImages the vehicleImages to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vehicleImages,
     * or with status {@code 400 (Bad Request)} if the vehicleImages is not valid,
     * or with status {@code 404 (Not Found)} if the vehicleImages is not found,
     * or with status {@code 500 (Internal Server Error)} if the vehicleImages couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vehicle-images/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<VehicleImages> partialUpdateVehicleImages(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody VehicleImages vehicleImages
    ) throws URISyntaxException {
        log.debug("REST request to partial update VehicleImages partially : {}, {}", id, vehicleImages);
        if (vehicleImages.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vehicleImages.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vehicleImagesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VehicleImages> result = vehicleImagesRepository
            .findById(vehicleImages.getId())
            .map(
                existingVehicleImages -> {
                    if (vehicleImages.getContentType() != null) {
                        existingVehicleImages.setContentType(vehicleImages.getContentType());
                    }
                    if (vehicleImages.getImage() != null) {
                        existingVehicleImages.setImage(vehicleImages.getImage());
                    }
                    if (vehicleImages.getImageContentType() != null) {
                        existingVehicleImages.setImageContentType(vehicleImages.getImageContentType());
                    }

                    return existingVehicleImages;
                }
            )
            .map(vehicleImagesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vehicleImages.getId().toString())
        );
    }

    /**
     * {@code GET  /vehicle-images} : get all the vehicleImages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vehicleImages in body.
     */
    @GetMapping("/vehicle-images")
    public List<VehicleImages> getAllVehicleImages() {
        log.debug("REST request to get all VehicleImages");
        return vehicleImagesRepository.findAll();
    }

    /**
     * {@code GET  /vehicle-images/:id} : get the "id" vehicleImages.
     *
     * @param id the id of the vehicleImages to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vehicleImages, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vehicle-images/{id}")
    public ResponseEntity<VehicleImages> getVehicleImages(@PathVariable Long id) {
        log.debug("REST request to get VehicleImages : {}", id);
        Optional<VehicleImages> vehicleImages = vehicleImagesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(vehicleImages);
    }

    /**
     * {@code DELETE  /vehicle-images/:id} : delete the "id" vehicleImages.
     *
     * @param id the id of the vehicleImages to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vehicle-images/{id}")
    public ResponseEntity<Void> deleteVehicleImages(@PathVariable Long id) {
        log.debug("REST request to delete VehicleImages : {}", id);
        vehicleImagesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
