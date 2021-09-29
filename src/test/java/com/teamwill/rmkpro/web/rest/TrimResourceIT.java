package com.teamwill.rmkpro.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.teamwill.rmkpro.IntegrationTest;
import com.teamwill.rmkpro.domain.Trim;
import com.teamwill.rmkpro.domain.enumeration.FuelType;
import com.teamwill.rmkpro.repository.TrimRepository;
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
 * Integration tests for the {@link TrimResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TrimResourceIT {

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final Integer DEFAULT_DOORS = 1;
    private static final Integer UPDATED_DOORS = 2;

    private static final Integer DEFAULT_SEATS = 1;
    private static final Integer UPDATED_SEATS = 2;

    private static final Integer DEFAULT_ENGINE_DISPLACEMENT_CC = 1;
    private static final Integer UPDATED_ENGINE_DISPLACEMENT_CC = 2;

    private static final Boolean DEFAULT_IS_AUTOMATIC = false;
    private static final Boolean UPDATED_IS_AUTOMATIC = true;

    private static final FuelType DEFAULT_FUEL_TYPE = FuelType.PETROL;
    private static final FuelType UPDATED_FUEL_TYPE = FuelType.DIESEL;

    private static final String ENTITY_API_URL = "/api/trims";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TrimRepository trimRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTrimMockMvc;

    private Trim trim;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Trim createEntity(EntityManager em) {
        Trim trim = new Trim()
            .label(DEFAULT_LABEL)
            .doors(DEFAULT_DOORS)
            .seats(DEFAULT_SEATS)
            .engineDisplacementCc(DEFAULT_ENGINE_DISPLACEMENT_CC)
            .isAutomatic(DEFAULT_IS_AUTOMATIC)
            .fuelType(DEFAULT_FUEL_TYPE);
        return trim;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Trim createUpdatedEntity(EntityManager em) {
        Trim trim = new Trim()
            .label(UPDATED_LABEL)
            .doors(UPDATED_DOORS)
            .seats(UPDATED_SEATS)
            .engineDisplacementCc(UPDATED_ENGINE_DISPLACEMENT_CC)
            .isAutomatic(UPDATED_IS_AUTOMATIC)
            .fuelType(UPDATED_FUEL_TYPE);
        return trim;
    }

    @BeforeEach
    public void initTest() {
        trim = createEntity(em);
    }

    @Test
    @Transactional
    void createTrim() throws Exception {
        int databaseSizeBeforeCreate = trimRepository.findAll().size();
        // Create the Trim
        restTrimMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isCreated());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeCreate + 1);
        Trim testTrim = trimList.get(trimList.size() - 1);
        assertThat(testTrim.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testTrim.getDoors()).isEqualTo(DEFAULT_DOORS);
        assertThat(testTrim.getSeats()).isEqualTo(DEFAULT_SEATS);
        assertThat(testTrim.getEngineDisplacementCc()).isEqualTo(DEFAULT_ENGINE_DISPLACEMENT_CC);
        assertThat(testTrim.getIsAutomatic()).isEqualTo(DEFAULT_IS_AUTOMATIC);
        assertThat(testTrim.getFuelType()).isEqualTo(DEFAULT_FUEL_TYPE);
    }

    @Test
    @Transactional
    void createTrimWithExistingId() throws Exception {
        // Create the Trim with an existing ID
        trim.setId(1L);

        int databaseSizeBeforeCreate = trimRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTrimMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = trimRepository.findAll().size();
        // set the field null
        trim.setLabel(null);

        // Create the Trim, which fails.

        restTrimMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isBadRequest());

        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDoorsIsRequired() throws Exception {
        int databaseSizeBeforeTest = trimRepository.findAll().size();
        // set the field null
        trim.setDoors(null);

        // Create the Trim, which fails.

        restTrimMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isBadRequest());

        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSeatsIsRequired() throws Exception {
        int databaseSizeBeforeTest = trimRepository.findAll().size();
        // set the field null
        trim.setSeats(null);

        // Create the Trim, which fails.

        restTrimMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isBadRequest());

        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEngineDisplacementCcIsRequired() throws Exception {
        int databaseSizeBeforeTest = trimRepository.findAll().size();
        // set the field null
        trim.setEngineDisplacementCc(null);

        // Create the Trim, which fails.

        restTrimMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isBadRequest());

        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkFuelTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = trimRepository.findAll().size();
        // set the field null
        trim.setFuelType(null);

        // Create the Trim, which fails.

        restTrimMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isBadRequest());

        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTrims() throws Exception {
        // Initialize the database
        trimRepository.saveAndFlush(trim);

        // Get all the trimList
        restTrimMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(trim.getId().intValue())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].doors").value(hasItem(DEFAULT_DOORS)))
            .andExpect(jsonPath("$.[*].seats").value(hasItem(DEFAULT_SEATS)))
            .andExpect(jsonPath("$.[*].engineDisplacementCc").value(hasItem(DEFAULT_ENGINE_DISPLACEMENT_CC)))
            .andExpect(jsonPath("$.[*].isAutomatic").value(hasItem(DEFAULT_IS_AUTOMATIC.booleanValue())))
            .andExpect(jsonPath("$.[*].fuelType").value(hasItem(DEFAULT_FUEL_TYPE.toString())));
    }

    @Test
    @Transactional
    void getTrim() throws Exception {
        // Initialize the database
        trimRepository.saveAndFlush(trim);

        // Get the trim
        restTrimMockMvc
            .perform(get(ENTITY_API_URL_ID, trim.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(trim.getId().intValue()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.doors").value(DEFAULT_DOORS))
            .andExpect(jsonPath("$.seats").value(DEFAULT_SEATS))
            .andExpect(jsonPath("$.engineDisplacementCc").value(DEFAULT_ENGINE_DISPLACEMENT_CC))
            .andExpect(jsonPath("$.isAutomatic").value(DEFAULT_IS_AUTOMATIC.booleanValue()))
            .andExpect(jsonPath("$.fuelType").value(DEFAULT_FUEL_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTrim() throws Exception {
        // Get the trim
        restTrimMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTrim() throws Exception {
        // Initialize the database
        trimRepository.saveAndFlush(trim);

        int databaseSizeBeforeUpdate = trimRepository.findAll().size();

        // Update the trim
        Trim updatedTrim = trimRepository.findById(trim.getId()).get();
        // Disconnect from session so that the updates on updatedTrim are not directly saved in db
        em.detach(updatedTrim);
        updatedTrim
            .label(UPDATED_LABEL)
            .doors(UPDATED_DOORS)
            .seats(UPDATED_SEATS)
            .engineDisplacementCc(UPDATED_ENGINE_DISPLACEMENT_CC)
            .isAutomatic(UPDATED_IS_AUTOMATIC)
            .fuelType(UPDATED_FUEL_TYPE);

        restTrimMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTrim.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTrim))
            )
            .andExpect(status().isOk());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeUpdate);
        Trim testTrim = trimList.get(trimList.size() - 1);
        assertThat(testTrim.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testTrim.getDoors()).isEqualTo(UPDATED_DOORS);
        assertThat(testTrim.getSeats()).isEqualTo(UPDATED_SEATS);
        assertThat(testTrim.getEngineDisplacementCc()).isEqualTo(UPDATED_ENGINE_DISPLACEMENT_CC);
        assertThat(testTrim.getIsAutomatic()).isEqualTo(UPDATED_IS_AUTOMATIC);
        assertThat(testTrim.getFuelType()).isEqualTo(UPDATED_FUEL_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingTrim() throws Exception {
        int databaseSizeBeforeUpdate = trimRepository.findAll().size();
        trim.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrimMockMvc
            .perform(
                put(ENTITY_API_URL_ID, trim.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTrim() throws Exception {
        int databaseSizeBeforeUpdate = trimRepository.findAll().size();
        trim.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrimMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTrim() throws Exception {
        int databaseSizeBeforeUpdate = trimRepository.findAll().size();
        trim.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrimMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTrimWithPatch() throws Exception {
        // Initialize the database
        trimRepository.saveAndFlush(trim);

        int databaseSizeBeforeUpdate = trimRepository.findAll().size();

        // Update the trim using partial update
        Trim partialUpdatedTrim = new Trim();
        partialUpdatedTrim.setId(trim.getId());

        partialUpdatedTrim.label(UPDATED_LABEL).doors(UPDATED_DOORS).engineDisplacementCc(UPDATED_ENGINE_DISPLACEMENT_CC);

        restTrimMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrim.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrim))
            )
            .andExpect(status().isOk());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeUpdate);
        Trim testTrim = trimList.get(trimList.size() - 1);
        assertThat(testTrim.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testTrim.getDoors()).isEqualTo(UPDATED_DOORS);
        assertThat(testTrim.getSeats()).isEqualTo(DEFAULT_SEATS);
        assertThat(testTrim.getEngineDisplacementCc()).isEqualTo(UPDATED_ENGINE_DISPLACEMENT_CC);
        assertThat(testTrim.getIsAutomatic()).isEqualTo(DEFAULT_IS_AUTOMATIC);
        assertThat(testTrim.getFuelType()).isEqualTo(DEFAULT_FUEL_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateTrimWithPatch() throws Exception {
        // Initialize the database
        trimRepository.saveAndFlush(trim);

        int databaseSizeBeforeUpdate = trimRepository.findAll().size();

        // Update the trim using partial update
        Trim partialUpdatedTrim = new Trim();
        partialUpdatedTrim.setId(trim.getId());

        partialUpdatedTrim
            .label(UPDATED_LABEL)
            .doors(UPDATED_DOORS)
            .seats(UPDATED_SEATS)
            .engineDisplacementCc(UPDATED_ENGINE_DISPLACEMENT_CC)
            .isAutomatic(UPDATED_IS_AUTOMATIC)
            .fuelType(UPDATED_FUEL_TYPE);

        restTrimMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrim.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrim))
            )
            .andExpect(status().isOk());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeUpdate);
        Trim testTrim = trimList.get(trimList.size() - 1);
        assertThat(testTrim.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testTrim.getDoors()).isEqualTo(UPDATED_DOORS);
        assertThat(testTrim.getSeats()).isEqualTo(UPDATED_SEATS);
        assertThat(testTrim.getEngineDisplacementCc()).isEqualTo(UPDATED_ENGINE_DISPLACEMENT_CC);
        assertThat(testTrim.getIsAutomatic()).isEqualTo(UPDATED_IS_AUTOMATIC);
        assertThat(testTrim.getFuelType()).isEqualTo(UPDATED_FUEL_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingTrim() throws Exception {
        int databaseSizeBeforeUpdate = trimRepository.findAll().size();
        trim.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrimMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, trim.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTrim() throws Exception {
        int databaseSizeBeforeUpdate = trimRepository.findAll().size();
        trim.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrimMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTrim() throws Exception {
        int databaseSizeBeforeUpdate = trimRepository.findAll().size();
        trim.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrimMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trim))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Trim in the database
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTrim() throws Exception {
        // Initialize the database
        trimRepository.saveAndFlush(trim);

        int databaseSizeBeforeDelete = trimRepository.findAll().size();

        // Delete the trim
        restTrimMockMvc
            .perform(delete(ENTITY_API_URL_ID, trim.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Trim> trimList = trimRepository.findAll();
        assertThat(trimList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
