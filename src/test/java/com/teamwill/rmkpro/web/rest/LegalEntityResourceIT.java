package com.teamwill.rmkpro.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.teamwill.rmkpro.IntegrationTest;
import com.teamwill.rmkpro.domain.LegalEntity;
import com.teamwill.rmkpro.domain.enumeration.LegalEntityType;
import com.teamwill.rmkpro.repository.LegalEntityRepository;
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
 * Integration tests for the {@link LegalEntityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LegalEntityResourceIT {

    private static final String DEFAULT_POST_CODE = "AAAAAAAAAA";
    private static final String UPDATED_POST_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_STREET_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_STREET_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final LegalEntityType DEFAULT_TYPE = LegalEntityType.PRIVATE_INDIVIDUAL;
    private static final LegalEntityType UPDATED_TYPE = LegalEntityType.CORPORATION;

    private static final String ENTITY_API_URL = "/api/legal-entities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LegalEntityRepository legalEntityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLegalEntityMockMvc;

    private LegalEntity legalEntity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LegalEntity createEntity(EntityManager em) {
        LegalEntity legalEntity = new LegalEntity()
            .postCode(DEFAULT_POST_CODE)
            .streetAddress(DEFAULT_STREET_ADDRESS)
            .email(DEFAULT_EMAIL)
            .phone(DEFAULT_PHONE)
            .type(DEFAULT_TYPE);
        return legalEntity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LegalEntity createUpdatedEntity(EntityManager em) {
        LegalEntity legalEntity = new LegalEntity()
            .postCode(UPDATED_POST_CODE)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .type(UPDATED_TYPE);
        return legalEntity;
    }

    @BeforeEach
    public void initTest() {
        legalEntity = createEntity(em);
    }

    @Test
    @Transactional
    void createLegalEntity() throws Exception {
        int databaseSizeBeforeCreate = legalEntityRepository.findAll().size();
        // Create the LegalEntity
        restLegalEntityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isCreated());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeCreate + 1);
        LegalEntity testLegalEntity = legalEntityList.get(legalEntityList.size() - 1);
        assertThat(testLegalEntity.getPostCode()).isEqualTo(DEFAULT_POST_CODE);
        assertThat(testLegalEntity.getStreetAddress()).isEqualTo(DEFAULT_STREET_ADDRESS);
        assertThat(testLegalEntity.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testLegalEntity.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testLegalEntity.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void createLegalEntityWithExistingId() throws Exception {
        // Create the LegalEntity with an existing ID
        legalEntity.setId(1L);

        int databaseSizeBeforeCreate = legalEntityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLegalEntityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPostCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = legalEntityRepository.findAll().size();
        // set the field null
        legalEntity.setPostCode(null);

        // Create the LegalEntity, which fails.

        restLegalEntityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStreetAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = legalEntityRepository.findAll().size();
        // set the field null
        legalEntity.setStreetAddress(null);

        // Create the LegalEntity, which fails.

        restLegalEntityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = legalEntityRepository.findAll().size();
        // set the field null
        legalEntity.setEmail(null);

        // Create the LegalEntity, which fails.

        restLegalEntityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLegalEntities() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        // Get all the legalEntityList
        restLegalEntityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(legalEntity.getId().intValue())))
            .andExpect(jsonPath("$.[*].postCode").value(hasItem(DEFAULT_POST_CODE)))
            .andExpect(jsonPath("$.[*].streetAddress").value(hasItem(DEFAULT_STREET_ADDRESS)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    void getLegalEntity() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        // Get the legalEntity
        restLegalEntityMockMvc
            .perform(get(ENTITY_API_URL_ID, legalEntity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(legalEntity.getId().intValue()))
            .andExpect(jsonPath("$.postCode").value(DEFAULT_POST_CODE))
            .andExpect(jsonPath("$.streetAddress").value(DEFAULT_STREET_ADDRESS))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLegalEntity() throws Exception {
        // Get the legalEntity
        restLegalEntityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLegalEntity() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();

        // Update the legalEntity
        LegalEntity updatedLegalEntity = legalEntityRepository.findById(legalEntity.getId()).get();
        // Disconnect from session so that the updates on updatedLegalEntity are not directly saved in db
        em.detach(updatedLegalEntity);
        updatedLegalEntity
            .postCode(UPDATED_POST_CODE)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .type(UPDATED_TYPE);

        restLegalEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLegalEntity.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLegalEntity))
            )
            .andExpect(status().isOk());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
        LegalEntity testLegalEntity = legalEntityList.get(legalEntityList.size() - 1);
        assertThat(testLegalEntity.getPostCode()).isEqualTo(UPDATED_POST_CODE);
        assertThat(testLegalEntity.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testLegalEntity.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testLegalEntity.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testLegalEntity.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, legalEntity.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLegalEntityWithPatch() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();

        // Update the legalEntity using partial update
        LegalEntity partialUpdatedLegalEntity = new LegalEntity();
        partialUpdatedLegalEntity.setId(legalEntity.getId());

        partialUpdatedLegalEntity
            .postCode(UPDATED_POST_CODE)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE);

        restLegalEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLegalEntity.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLegalEntity))
            )
            .andExpect(status().isOk());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
        LegalEntity testLegalEntity = legalEntityList.get(legalEntityList.size() - 1);
        assertThat(testLegalEntity.getPostCode()).isEqualTo(UPDATED_POST_CODE);
        assertThat(testLegalEntity.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testLegalEntity.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testLegalEntity.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testLegalEntity.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateLegalEntityWithPatch() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();

        // Update the legalEntity using partial update
        LegalEntity partialUpdatedLegalEntity = new LegalEntity();
        partialUpdatedLegalEntity.setId(legalEntity.getId());

        partialUpdatedLegalEntity
            .postCode(UPDATED_POST_CODE)
            .streetAddress(UPDATED_STREET_ADDRESS)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .type(UPDATED_TYPE);

        restLegalEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLegalEntity.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLegalEntity))
            )
            .andExpect(status().isOk());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
        LegalEntity testLegalEntity = legalEntityList.get(legalEntityList.size() - 1);
        assertThat(testLegalEntity.getPostCode()).isEqualTo(UPDATED_POST_CODE);
        assertThat(testLegalEntity.getStreetAddress()).isEqualTo(UPDATED_STREET_ADDRESS);
        assertThat(testLegalEntity.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testLegalEntity.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testLegalEntity.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, legalEntity.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLegalEntity() throws Exception {
        int databaseSizeBeforeUpdate = legalEntityRepository.findAll().size();
        legalEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLegalEntityMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(legalEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LegalEntity in the database
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLegalEntity() throws Exception {
        // Initialize the database
        legalEntityRepository.saveAndFlush(legalEntity);

        int databaseSizeBeforeDelete = legalEntityRepository.findAll().size();

        // Delete the legalEntity
        restLegalEntityMockMvc
            .perform(delete(ENTITY_API_URL_ID, legalEntity.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LegalEntity> legalEntityList = legalEntityRepository.findAll();
        assertThat(legalEntityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
