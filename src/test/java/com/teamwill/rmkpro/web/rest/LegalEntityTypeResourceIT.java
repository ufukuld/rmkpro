package com.teamwill.rmkpro.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.teamwill.rmkpro.IntegrationTest;
import com.teamwill.rmkpro.domain.LegalEntityType;
import com.teamwill.rmkpro.repository.LegalEntityTypeRepository;
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

/**
 * Integration tests for the {@link LegalEntityTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LegalEntityTypeResourceIT {

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/legal-entity-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LegalEntityTypeRepository legalEntityTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLegalEntityTypeMockMvc;

    private LegalEntityType legalEntityType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LegalEntityType createEntity(EntityManager em) {
        LegalEntityType legalEntityType = new LegalEntityType().label(DEFAULT_LABEL);
        return legalEntityType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LegalEntityType createUpdatedEntity(EntityManager em) {
        LegalEntityType legalEntityType = new LegalEntityType().label(UPDATED_LABEL);
        return legalEntityType;
    }

    @BeforeEach
    public void initTest() {
        legalEntityType = createEntity(em);
    }

    @Test
    @Transactional
    void createLegalEntityType() throws Exception {
        int databaseSizeBeforeCreate = legalEntityTypeRepository.findAll().size();
        // Create the LegalEntityType
        restLegalEntityTypeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntityType))
            )
            .andExpect(status().isCreated());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeCreate + 1);
        LegalEntityType testLegalEntityType = legalEntityTypeList.get(legalEntityTypeList.size() - 1);
        assertThat(testLegalEntityType.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    void createLegalEntityTypeWithExistingId() throws Exception {
        // Create the LegalEntityType with an existing ID
        legalEntityType.setId(1L);

        int databaseSizeBeforeCreate = legalEntityTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLegalEntityTypeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntityType))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = legalEntityTypeRepository.findAll().size();
        // set the field null
        legalEntityType.setLabel(null);

        // Create the LegalEntityType, which fails.

        restLegalEntityTypeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntityType))
            )
            .andExpect(status().isBadRequest());

        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLegalEntityTypes() throws Exception {
        // Initialize the database
        legalEntityTypeRepository.saveAndFlush(legalEntityType);

        // Get all the legalEntityTypeList
        restLegalEntityTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(legalEntityType.getId().intValue())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)));
    }

    @Test
    @Transactional
    void getLegalEntityType() throws Exception {
        // Initialize the database
        legalEntityTypeRepository.saveAndFlush(legalEntityType);

        // Get the legalEntityType
        restLegalEntityTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, legalEntityType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(legalEntityType.getId().intValue()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL));
    }

    @Test
    @Transactional
    void getNonExistingLegalEntityType() throws Exception {
        // Get the legalEntityType
        restLegalEntityTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLegalEntityType() throws Exception {
        // Initialize the database
        legalEntityTypeRepository.saveAndFlush(legalEntityType);

        int databaseSizeBeforeUpdate = legalEntityTypeRepository.findAll().size();

        // Update the legalEntityType
        LegalEntityType updatedLegalEntityType = legalEntityTypeRepository.findById(legalEntityType.getId()).get();
        // Disconnect from session so that the updates on updatedLegalEntityType are not directly saved in db
        em.detach(updatedLegalEntityType);
        updatedLegalEntityType.label(UPDATED_LABEL);

        restLegalEntityTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLegalEntityType.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLegalEntityType))
            )
            .andExpect(status().isOk());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeUpdate);
        LegalEntityType testLegalEntityType = legalEntityTypeList.get(legalEntityTypeList.size() - 1);
        assertThat(testLegalEntityType.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void putNonExistingLegalEntityType() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityTypeRepository.findAll().size();
        legalEntityType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLegalEntityTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, legalEntityType.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntityType))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLegalEntityType() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityTypeRepository.findAll().size();
        legalEntityType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntityType))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLegalEntityType() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityTypeRepository.findAll().size();
        legalEntityType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityTypeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntityType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLegalEntityTypeWithPatch() throws Exception {
        // Initialize the database
        legalEntityTypeRepository.saveAndFlush(legalEntityType);

        int databaseSizeBeforeUpdate = legalEntityTypeRepository.findAll().size();

        // Update the legalEntityType using partial update
        LegalEntityType partialUpdatedLegalEntityType = new LegalEntityType();
        partialUpdatedLegalEntityType.setId(legalEntityType.getId());

        restLegalEntityTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLegalEntityType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLegalEntityType))
            )
            .andExpect(status().isOk());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeUpdate);
        LegalEntityType testLegalEntityType = legalEntityTypeList.get(legalEntityTypeList.size() - 1);
        assertThat(testLegalEntityType.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    void fullUpdateLegalEntityTypeWithPatch() throws Exception {
        // Initialize the database
        legalEntityTypeRepository.saveAndFlush(legalEntityType);

        int databaseSizeBeforeUpdate = legalEntityTypeRepository.findAll().size();

        // Update the legalEntityType using partial update
        LegalEntityType partialUpdatedLegalEntityType = new LegalEntityType();
        partialUpdatedLegalEntityType.setId(legalEntityType.getId());

        partialUpdatedLegalEntityType.label(UPDATED_LABEL);

        restLegalEntityTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLegalEntityType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLegalEntityType))
            )
            .andExpect(status().isOk());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeUpdate);
        LegalEntityType testLegalEntityType = legalEntityTypeList.get(legalEntityTypeList.size() - 1);
        assertThat(testLegalEntityType.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void patchNonExistingLegalEntityType() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityTypeRepository.findAll().size();
        legalEntityType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLegalEntityTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, legalEntityType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalEntityType))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLegalEntityType() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityTypeRepository.findAll().size();
        legalEntityType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalEntityType))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLegalEntityType() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityTypeRepository.findAll().size();
        legalEntityType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityTypeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalEntityType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LegalEntityType in the database
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLegalEntityType() throws Exception {
        // Initialize the database
        legalEntityTypeRepository.saveAndFlush(legalEntityType);

        int databaseSizeBeforeDelete = legalEntityTypeRepository.findAll().size();

        // Delete the legalEntityType
        restLegalEntityTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, legalEntityType.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LegalEntityType> legalEntityTypeList = legalEntityTypeRepository.findAll();
        assertThat(legalEntityTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
