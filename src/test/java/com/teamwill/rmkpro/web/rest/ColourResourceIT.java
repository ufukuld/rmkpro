package com.teamwill.rmkpro.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.teamwill.rmkpro.IntegrationTest;
import com.teamwill.rmkpro.domain.Colour;
import com.teamwill.rmkpro.domain.enumeration.PaintType;
import com.teamwill.rmkpro.repository.ColourRepository;
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
 * Integration tests for the {@link ColourResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ColourResourceIT {

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final PaintType DEFAULT_PAINT_TYPE = PaintType.SOLID;
    private static final PaintType UPDATED_PAINT_TYPE = PaintType.METALLIC;

    private static final String ENTITY_API_URL = "/api/colours";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ColourRepository colourRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restColourMockMvc;

    private Colour colour;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Colour createEntity(EntityManager em) {
        Colour colour = new Colour().label(DEFAULT_LABEL).paintType(DEFAULT_PAINT_TYPE);
        return colour;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Colour createUpdatedEntity(EntityManager em) {
        Colour colour = new Colour().label(UPDATED_LABEL).paintType(UPDATED_PAINT_TYPE);
        return colour;
    }

    @BeforeEach
    public void initTest() {
        colour = createEntity(em);
    }

    @Test
    @Transactional
    void createColour() throws Exception {
        int databaseSizeBeforeCreate = colourRepository.findAll().size();
        // Create the Colour
        restColourMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(colour))
            )
            .andExpect(status().isCreated());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeCreate + 1);
        Colour testColour = colourList.get(colourList.size() - 1);
        assertThat(testColour.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testColour.getPaintType()).isEqualTo(DEFAULT_PAINT_TYPE);
    }

    @Test
    @Transactional
    void createColourWithExistingId() throws Exception {
        // Create the Colour with an existing ID
        colour.setId(1L);

        int databaseSizeBeforeCreate = colourRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restColourMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(colour))
            )
            .andExpect(status().isBadRequest());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = colourRepository.findAll().size();
        // set the field null
        colour.setLabel(null);

        // Create the Colour, which fails.

        restColourMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(colour))
            )
            .andExpect(status().isBadRequest());

        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPaintTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = colourRepository.findAll().size();
        // set the field null
        colour.setPaintType(null);

        // Create the Colour, which fails.

        restColourMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(colour))
            )
            .andExpect(status().isBadRequest());

        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllColours() throws Exception {
        // Initialize the database
        colourRepository.saveAndFlush(colour);

        // Get all the colourList
        restColourMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(colour.getId().intValue())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].paintType").value(hasItem(DEFAULT_PAINT_TYPE.toString())));
    }

    @Test
    @Transactional
    void getColour() throws Exception {
        // Initialize the database
        colourRepository.saveAndFlush(colour);

        // Get the colour
        restColourMockMvc
            .perform(get(ENTITY_API_URL_ID, colour.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(colour.getId().intValue()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.paintType").value(DEFAULT_PAINT_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingColour() throws Exception {
        // Get the colour
        restColourMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewColour() throws Exception {
        // Initialize the database
        colourRepository.saveAndFlush(colour);

        int databaseSizeBeforeUpdate = colourRepository.findAll().size();

        // Update the colour
        Colour updatedColour = colourRepository.findById(colour.getId()).get();
        // Disconnect from session so that the updates on updatedColour are not directly saved in db
        em.detach(updatedColour);
        updatedColour.label(UPDATED_LABEL).paintType(UPDATED_PAINT_TYPE);

        restColourMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedColour.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedColour))
            )
            .andExpect(status().isOk());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeUpdate);
        Colour testColour = colourList.get(colourList.size() - 1);
        assertThat(testColour.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testColour.getPaintType()).isEqualTo(UPDATED_PAINT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingColour() throws Exception {
        int databaseSizeBeforeUpdate = colourRepository.findAll().size();
        colour.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restColourMockMvc
            .perform(
                put(ENTITY_API_URL_ID, colour.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(colour))
            )
            .andExpect(status().isBadRequest());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchColour() throws Exception {
        int databaseSizeBeforeUpdate = colourRepository.findAll().size();
        colour.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restColourMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(colour))
            )
            .andExpect(status().isBadRequest());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamColour() throws Exception {
        int databaseSizeBeforeUpdate = colourRepository.findAll().size();
        colour.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restColourMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(colour))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateColourWithPatch() throws Exception {
        // Initialize the database
        colourRepository.saveAndFlush(colour);

        int databaseSizeBeforeUpdate = colourRepository.findAll().size();

        // Update the colour using partial update
        Colour partialUpdatedColour = new Colour();
        partialUpdatedColour.setId(colour.getId());

        partialUpdatedColour.paintType(UPDATED_PAINT_TYPE);

        restColourMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedColour.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedColour))
            )
            .andExpect(status().isOk());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeUpdate);
        Colour testColour = colourList.get(colourList.size() - 1);
        assertThat(testColour.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testColour.getPaintType()).isEqualTo(UPDATED_PAINT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateColourWithPatch() throws Exception {
        // Initialize the database
        colourRepository.saveAndFlush(colour);

        int databaseSizeBeforeUpdate = colourRepository.findAll().size();

        // Update the colour using partial update
        Colour partialUpdatedColour = new Colour();
        partialUpdatedColour.setId(colour.getId());

        partialUpdatedColour.label(UPDATED_LABEL).paintType(UPDATED_PAINT_TYPE);

        restColourMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedColour.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedColour))
            )
            .andExpect(status().isOk());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeUpdate);
        Colour testColour = colourList.get(colourList.size() - 1);
        assertThat(testColour.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testColour.getPaintType()).isEqualTo(UPDATED_PAINT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingColour() throws Exception {
        int databaseSizeBeforeUpdate = colourRepository.findAll().size();
        colour.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restColourMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, colour.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(colour))
            )
            .andExpect(status().isBadRequest());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchColour() throws Exception {
        int databaseSizeBeforeUpdate = colourRepository.findAll().size();
        colour.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restColourMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(colour))
            )
            .andExpect(status().isBadRequest());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamColour() throws Exception {
        int databaseSizeBeforeUpdate = colourRepository.findAll().size();
        colour.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restColourMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(colour))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Colour in the database
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteColour() throws Exception {
        // Initialize the database
        colourRepository.saveAndFlush(colour);

        int databaseSizeBeforeDelete = colourRepository.findAll().size();

        // Delete the colour
        restColourMockMvc
            .perform(delete(ENTITY_API_URL_ID, colour.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Colour> colourList = colourRepository.findAll();
        assertThat(colourList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
