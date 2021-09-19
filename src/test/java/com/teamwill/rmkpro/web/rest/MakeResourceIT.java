package com.teamwill.rmkpro.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.teamwill.rmkpro.IntegrationTest;
import com.teamwill.rmkpro.domain.Make;
import com.teamwill.rmkpro.repository.MakeRepository;
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
 * Integration tests for the {@link MakeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MakeResourceIT {

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/makes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MakeRepository makeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMakeMockMvc;

    private Make make;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Make createEntity(EntityManager em) {
        Make make = new Make().label(DEFAULT_LABEL);
        return make;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Make createUpdatedEntity(EntityManager em) {
        Make make = new Make().label(UPDATED_LABEL);
        return make;
    }

    @BeforeEach
    public void initTest() {
        make = createEntity(em);
    }

    @Test
    @Transactional
    void createMake() throws Exception {
        int databaseSizeBeforeCreate = makeRepository.findAll().size();
        // Create the Make
        restMakeMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(make))
            )
            .andExpect(status().isCreated());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeCreate + 1);
        Make testMake = makeList.get(makeList.size() - 1);
        assertThat(testMake.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    void createMakeWithExistingId() throws Exception {
        // Create the Make with an existing ID
        make.setId(1L);

        int databaseSizeBeforeCreate = makeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMakeMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(make))
            )
            .andExpect(status().isBadRequest());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = makeRepository.findAll().size();
        // set the field null
        make.setLabel(null);

        // Create the Make, which fails.

        restMakeMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(make))
            )
            .andExpect(status().isBadRequest());

        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMakes() throws Exception {
        // Initialize the database
        makeRepository.saveAndFlush(make);

        // Get all the makeList
        restMakeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(make.getId().intValue())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)));
    }

    @Test
    @Transactional
    void getMake() throws Exception {
        // Initialize the database
        makeRepository.saveAndFlush(make);

        // Get the make
        restMakeMockMvc
            .perform(get(ENTITY_API_URL_ID, make.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(make.getId().intValue()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL));
    }

    @Test
    @Transactional
    void getNonExistingMake() throws Exception {
        // Get the make
        restMakeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMake() throws Exception {
        // Initialize the database
        makeRepository.saveAndFlush(make);

        int databaseSizeBeforeUpdate = makeRepository.findAll().size();

        // Update the make
        Make updatedMake = makeRepository.findById(make.getId()).get();
        // Disconnect from session so that the updates on updatedMake are not directly saved in db
        em.detach(updatedMake);
        updatedMake.label(UPDATED_LABEL);

        restMakeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMake.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMake))
            )
            .andExpect(status().isOk());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeUpdate);
        Make testMake = makeList.get(makeList.size() - 1);
        assertThat(testMake.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void putNonExistingMake() throws Exception {
        int databaseSizeBeforeUpdate = makeRepository.findAll().size();
        make.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMakeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, make.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(make))
            )
            .andExpect(status().isBadRequest());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMake() throws Exception {
        int databaseSizeBeforeUpdate = makeRepository.findAll().size();
        make.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMakeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(make))
            )
            .andExpect(status().isBadRequest());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMake() throws Exception {
        int databaseSizeBeforeUpdate = makeRepository.findAll().size();
        make.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMakeMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(make))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMakeWithPatch() throws Exception {
        // Initialize the database
        makeRepository.saveAndFlush(make);

        int databaseSizeBeforeUpdate = makeRepository.findAll().size();

        // Update the make using partial update
        Make partialUpdatedMake = new Make();
        partialUpdatedMake.setId(make.getId());

        partialUpdatedMake.label(UPDATED_LABEL);

        restMakeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMake.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMake))
            )
            .andExpect(status().isOk());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeUpdate);
        Make testMake = makeList.get(makeList.size() - 1);
        assertThat(testMake.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void fullUpdateMakeWithPatch() throws Exception {
        // Initialize the database
        makeRepository.saveAndFlush(make);

        int databaseSizeBeforeUpdate = makeRepository.findAll().size();

        // Update the make using partial update
        Make partialUpdatedMake = new Make();
        partialUpdatedMake.setId(make.getId());

        partialUpdatedMake.label(UPDATED_LABEL);

        restMakeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMake.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMake))
            )
            .andExpect(status().isOk());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeUpdate);
        Make testMake = makeList.get(makeList.size() - 1);
        assertThat(testMake.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    void patchNonExistingMake() throws Exception {
        int databaseSizeBeforeUpdate = makeRepository.findAll().size();
        make.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMakeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, make.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(make))
            )
            .andExpect(status().isBadRequest());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMake() throws Exception {
        int databaseSizeBeforeUpdate = makeRepository.findAll().size();
        make.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMakeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(make))
            )
            .andExpect(status().isBadRequest());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMake() throws Exception {
        int databaseSizeBeforeUpdate = makeRepository.findAll().size();
        make.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMakeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(make))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Make in the database
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMake() throws Exception {
        // Initialize the database
        makeRepository.saveAndFlush(make);

        int databaseSizeBeforeDelete = makeRepository.findAll().size();

        // Delete the make
        restMakeMockMvc
            .perform(delete(ENTITY_API_URL_ID, make.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Make> makeList = makeRepository.findAll();
        assertThat(makeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
