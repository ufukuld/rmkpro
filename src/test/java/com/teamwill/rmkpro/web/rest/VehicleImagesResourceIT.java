package com.teamwill.rmkpro.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.teamwill.rmkpro.IntegrationTest;
import com.teamwill.rmkpro.domain.VehicleImages;
import com.teamwill.rmkpro.repository.VehicleImagesRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link VehicleImagesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VehicleImagesResourceIT {

    private static final String DEFAULT_CONTENT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT_TYPE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/vehicle-images";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VehicleImagesRepository vehicleImagesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVehicleImagesMockMvc;

    private VehicleImages vehicleImages;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VehicleImages createEntity(EntityManager em) {
        VehicleImages vehicleImages = new VehicleImages()
            .contentType(DEFAULT_CONTENT_TYPE)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return vehicleImages;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VehicleImages createUpdatedEntity(EntityManager em) {
        VehicleImages vehicleImages = new VehicleImages()
            .contentType(UPDATED_CONTENT_TYPE)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);
        return vehicleImages;
    }

    @BeforeEach
    public void initTest() {
        vehicleImages = createEntity(em);
    }

    @Test
    @Transactional
    void createVehicleImages() throws Exception {
        int databaseSizeBeforeCreate = vehicleImagesRepository.findAll().size();
        // Create the VehicleImages
        restVehicleImagesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicleImages))
            )
            .andExpect(status().isCreated());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeCreate + 1);
        VehicleImages testVehicleImages = vehicleImagesList.get(vehicleImagesList.size() - 1);
        assertThat(testVehicleImages.getContentType()).isEqualTo(DEFAULT_CONTENT_TYPE);
        assertThat(testVehicleImages.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testVehicleImages.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createVehicleImagesWithExistingId() throws Exception {
        // Create the VehicleImages with an existing ID
        vehicleImages.setId(1L);

        int databaseSizeBeforeCreate = vehicleImagesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVehicleImagesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicleImages))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkContentTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = vehicleImagesRepository.findAll().size();
        // set the field null
        vehicleImages.setContentType(null);

        // Create the VehicleImages, which fails.

        restVehicleImagesMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicleImages))
            )
            .andExpect(status().isBadRequest());

        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVehicleImages() throws Exception {
        // Initialize the database
        vehicleImagesRepository.saveAndFlush(vehicleImages);

        // Get all the vehicleImagesList
        restVehicleImagesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vehicleImages.getId().intValue())))
            .andExpect(jsonPath("$.[*].contentType").value(hasItem(DEFAULT_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    void getVehicleImages() throws Exception {
        // Initialize the database
        vehicleImagesRepository.saveAndFlush(vehicleImages);

        // Get the vehicleImages
        restVehicleImagesMockMvc
            .perform(get(ENTITY_API_URL_ID, vehicleImages.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vehicleImages.getId().intValue()))
            .andExpect(jsonPath("$.contentType").value(DEFAULT_CONTENT_TYPE))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    void getNonExistingVehicleImages() throws Exception {
        // Get the vehicleImages
        restVehicleImagesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVehicleImages() throws Exception {
        // Initialize the database
        vehicleImagesRepository.saveAndFlush(vehicleImages);

        int databaseSizeBeforeUpdate = vehicleImagesRepository.findAll().size();

        // Update the vehicleImages
        VehicleImages updatedVehicleImages = vehicleImagesRepository.findById(vehicleImages.getId()).get();
        // Disconnect from session so that the updates on updatedVehicleImages are not directly saved in db
        em.detach(updatedVehicleImages);
        updatedVehicleImages.contentType(UPDATED_CONTENT_TYPE).image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restVehicleImagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVehicleImages.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVehicleImages))
            )
            .andExpect(status().isOk());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeUpdate);
        VehicleImages testVehicleImages = vehicleImagesList.get(vehicleImagesList.size() - 1);
        assertThat(testVehicleImages.getContentType()).isEqualTo(UPDATED_CONTENT_TYPE);
        assertThat(testVehicleImages.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testVehicleImages.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingVehicleImages() throws Exception {
        int databaseSizeBeforeUpdate = vehicleImagesRepository.findAll().size();
        vehicleImages.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehicleImagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vehicleImages.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicleImages))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVehicleImages() throws Exception {
        int databaseSizeBeforeUpdate = vehicleImagesRepository.findAll().size();
        vehicleImages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleImagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicleImages))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVehicleImages() throws Exception {
        int databaseSizeBeforeUpdate = vehicleImagesRepository.findAll().size();
        vehicleImages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleImagesMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicleImages))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVehicleImagesWithPatch() throws Exception {
        // Initialize the database
        vehicleImagesRepository.saveAndFlush(vehicleImages);

        int databaseSizeBeforeUpdate = vehicleImagesRepository.findAll().size();

        // Update the vehicleImages using partial update
        VehicleImages partialUpdatedVehicleImages = new VehicleImages();
        partialUpdatedVehicleImages.setId(vehicleImages.getId());

        partialUpdatedVehicleImages.contentType(UPDATED_CONTENT_TYPE).image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restVehicleImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehicleImages.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVehicleImages))
            )
            .andExpect(status().isOk());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeUpdate);
        VehicleImages testVehicleImages = vehicleImagesList.get(vehicleImagesList.size() - 1);
        assertThat(testVehicleImages.getContentType()).isEqualTo(UPDATED_CONTENT_TYPE);
        assertThat(testVehicleImages.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testVehicleImages.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateVehicleImagesWithPatch() throws Exception {
        // Initialize the database
        vehicleImagesRepository.saveAndFlush(vehicleImages);

        int databaseSizeBeforeUpdate = vehicleImagesRepository.findAll().size();

        // Update the vehicleImages using partial update
        VehicleImages partialUpdatedVehicleImages = new VehicleImages();
        partialUpdatedVehicleImages.setId(vehicleImages.getId());

        partialUpdatedVehicleImages.contentType(UPDATED_CONTENT_TYPE).image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restVehicleImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehicleImages.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVehicleImages))
            )
            .andExpect(status().isOk());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeUpdate);
        VehicleImages testVehicleImages = vehicleImagesList.get(vehicleImagesList.size() - 1);
        assertThat(testVehicleImages.getContentType()).isEqualTo(UPDATED_CONTENT_TYPE);
        assertThat(testVehicleImages.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testVehicleImages.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingVehicleImages() throws Exception {
        int databaseSizeBeforeUpdate = vehicleImagesRepository.findAll().size();
        vehicleImages.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehicleImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vehicleImages.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vehicleImages))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVehicleImages() throws Exception {
        int databaseSizeBeforeUpdate = vehicleImagesRepository.findAll().size();
        vehicleImages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vehicleImages))
            )
            .andExpect(status().isBadRequest());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVehicleImages() throws Exception {
        int databaseSizeBeforeUpdate = vehicleImagesRepository.findAll().size();
        vehicleImages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleImagesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vehicleImages))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VehicleImages in the database
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVehicleImages() throws Exception {
        // Initialize the database
        vehicleImagesRepository.saveAndFlush(vehicleImages);

        int databaseSizeBeforeDelete = vehicleImagesRepository.findAll().size();

        // Delete the vehicleImages
        restVehicleImagesMockMvc
            .perform(delete(ENTITY_API_URL_ID, vehicleImages.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VehicleImages> vehicleImagesList = vehicleImagesRepository.findAll();
        assertThat(vehicleImagesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
