package com.teamwill.rmkpro.web.rest;

import static com.teamwill.rmkpro.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.teamwill.rmkpro.IntegrationTest;
import com.teamwill.rmkpro.domain.Costs;
import com.teamwill.rmkpro.repository.CostsRepository;
import java.math.BigDecimal;
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
 * Integration tests for the {@link CostsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CostsResourceIT {

    private static final String DEFAULT_DETAIL = "AAAAAAAAAA";
    private static final String UPDATED_DETAIL = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_UNIT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_UNIT_PRICE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_VAT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_VAT_AMOUNT = new BigDecimal(2);

    private static final BigDecimal DEFAULT_VAT_PERCENTAGE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VAT_PERCENTAGE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_NET_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_NET_AMOUNT = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/costs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CostsRepository costsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCostsMockMvc;

    private Costs costs;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Costs createEntity(EntityManager em) {
        Costs costs = new Costs()
            .detail(DEFAULT_DETAIL)
            .unitPrice(DEFAULT_UNIT_PRICE)
            .vatAmount(DEFAULT_VAT_AMOUNT)
            .vatPercentage(DEFAULT_VAT_PERCENTAGE)
            .netAmount(DEFAULT_NET_AMOUNT);
        return costs;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Costs createUpdatedEntity(EntityManager em) {
        Costs costs = new Costs()
            .detail(UPDATED_DETAIL)
            .unitPrice(UPDATED_UNIT_PRICE)
            .vatAmount(UPDATED_VAT_AMOUNT)
            .vatPercentage(UPDATED_VAT_PERCENTAGE)
            .netAmount(UPDATED_NET_AMOUNT);
        return costs;
    }

    @BeforeEach
    public void initTest() {
        costs = createEntity(em);
    }

    @Test
    @Transactional
    void createCosts() throws Exception {
        int databaseSizeBeforeCreate = costsRepository.findAll().size();
        // Create the Costs
        restCostsMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(costs))
            )
            .andExpect(status().isCreated());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeCreate + 1);
        Costs testCosts = costsList.get(costsList.size() - 1);
        assertThat(testCosts.getDetail()).isEqualTo(DEFAULT_DETAIL);
        assertThat(testCosts.getUnitPrice()).isEqualByComparingTo(DEFAULT_UNIT_PRICE);
        assertThat(testCosts.getVatAmount()).isEqualByComparingTo(DEFAULT_VAT_AMOUNT);
        assertThat(testCosts.getVatPercentage()).isEqualByComparingTo(DEFAULT_VAT_PERCENTAGE);
        assertThat(testCosts.getNetAmount()).isEqualByComparingTo(DEFAULT_NET_AMOUNT);
    }

    @Test
    @Transactional
    void createCostsWithExistingId() throws Exception {
        // Create the Costs with an existing ID
        costs.setId(1L);

        int databaseSizeBeforeCreate = costsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCostsMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(costs))
            )
            .andExpect(status().isBadRequest());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDetailIsRequired() throws Exception {
        int databaseSizeBeforeTest = costsRepository.findAll().size();
        // set the field null
        costs.setDetail(null);

        // Create the Costs, which fails.

        restCostsMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(costs))
            )
            .andExpect(status().isBadRequest());

        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCosts() throws Exception {
        // Initialize the database
        costsRepository.saveAndFlush(costs);

        // Get all the costsList
        restCostsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(costs.getId().intValue())))
            .andExpect(jsonPath("$.[*].detail").value(hasItem(DEFAULT_DETAIL)))
            .andExpect(jsonPath("$.[*].unitPrice").value(hasItem(sameNumber(DEFAULT_UNIT_PRICE))))
            .andExpect(jsonPath("$.[*].vatAmount").value(hasItem(sameNumber(DEFAULT_VAT_AMOUNT))))
            .andExpect(jsonPath("$.[*].vatPercentage").value(hasItem(sameNumber(DEFAULT_VAT_PERCENTAGE))))
            .andExpect(jsonPath("$.[*].netAmount").value(hasItem(sameNumber(DEFAULT_NET_AMOUNT))));
    }

    @Test
    @Transactional
    void getCosts() throws Exception {
        // Initialize the database
        costsRepository.saveAndFlush(costs);

        // Get the costs
        restCostsMockMvc
            .perform(get(ENTITY_API_URL_ID, costs.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(costs.getId().intValue()))
            .andExpect(jsonPath("$.detail").value(DEFAULT_DETAIL))
            .andExpect(jsonPath("$.unitPrice").value(sameNumber(DEFAULT_UNIT_PRICE)))
            .andExpect(jsonPath("$.vatAmount").value(sameNumber(DEFAULT_VAT_AMOUNT)))
            .andExpect(jsonPath("$.vatPercentage").value(sameNumber(DEFAULT_VAT_PERCENTAGE)))
            .andExpect(jsonPath("$.netAmount").value(sameNumber(DEFAULT_NET_AMOUNT)));
    }

    @Test
    @Transactional
    void getNonExistingCosts() throws Exception {
        // Get the costs
        restCostsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCosts() throws Exception {
        // Initialize the database
        costsRepository.saveAndFlush(costs);

        int databaseSizeBeforeUpdate = costsRepository.findAll().size();

        // Update the costs
        Costs updatedCosts = costsRepository.findById(costs.getId()).get();
        // Disconnect from session so that the updates on updatedCosts are not directly saved in db
        em.detach(updatedCosts);
        updatedCosts
            .detail(UPDATED_DETAIL)
            .unitPrice(UPDATED_UNIT_PRICE)
            .vatAmount(UPDATED_VAT_AMOUNT)
            .vatPercentage(UPDATED_VAT_PERCENTAGE)
            .netAmount(UPDATED_NET_AMOUNT);

        restCostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCosts.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCosts))
            )
            .andExpect(status().isOk());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeUpdate);
        Costs testCosts = costsList.get(costsList.size() - 1);
        assertThat(testCosts.getDetail()).isEqualTo(UPDATED_DETAIL);
        assertThat(testCosts.getUnitPrice()).isEqualTo(UPDATED_UNIT_PRICE);
        assertThat(testCosts.getVatAmount()).isEqualTo(UPDATED_VAT_AMOUNT);
        assertThat(testCosts.getVatPercentage()).isEqualTo(UPDATED_VAT_PERCENTAGE);
        assertThat(testCosts.getNetAmount()).isEqualTo(UPDATED_NET_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingCosts() throws Exception {
        int databaseSizeBeforeUpdate = costsRepository.findAll().size();
        costs.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, costs.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(costs))
            )
            .andExpect(status().isBadRequest());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCosts() throws Exception {
        int databaseSizeBeforeUpdate = costsRepository.findAll().size();
        costs.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCostsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(costs))
            )
            .andExpect(status().isBadRequest());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCosts() throws Exception {
        int databaseSizeBeforeUpdate = costsRepository.findAll().size();
        costs.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCostsMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(costs))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCostsWithPatch() throws Exception {
        // Initialize the database
        costsRepository.saveAndFlush(costs);

        int databaseSizeBeforeUpdate = costsRepository.findAll().size();

        // Update the costs using partial update
        Costs partialUpdatedCosts = new Costs();
        partialUpdatedCosts.setId(costs.getId());

        partialUpdatedCosts
            .detail(UPDATED_DETAIL)
            .vatAmount(UPDATED_VAT_AMOUNT)
            .vatPercentage(UPDATED_VAT_PERCENTAGE)
            .netAmount(UPDATED_NET_AMOUNT);

        restCostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCosts.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCosts))
            )
            .andExpect(status().isOk());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeUpdate);
        Costs testCosts = costsList.get(costsList.size() - 1);
        assertThat(testCosts.getDetail()).isEqualTo(UPDATED_DETAIL);
        assertThat(testCosts.getUnitPrice()).isEqualByComparingTo(DEFAULT_UNIT_PRICE);
        assertThat(testCosts.getVatAmount()).isEqualByComparingTo(UPDATED_VAT_AMOUNT);
        assertThat(testCosts.getVatPercentage()).isEqualByComparingTo(UPDATED_VAT_PERCENTAGE);
        assertThat(testCosts.getNetAmount()).isEqualByComparingTo(UPDATED_NET_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdateCostsWithPatch() throws Exception {
        // Initialize the database
        costsRepository.saveAndFlush(costs);

        int databaseSizeBeforeUpdate = costsRepository.findAll().size();

        // Update the costs using partial update
        Costs partialUpdatedCosts = new Costs();
        partialUpdatedCosts.setId(costs.getId());

        partialUpdatedCosts
            .detail(UPDATED_DETAIL)
            .unitPrice(UPDATED_UNIT_PRICE)
            .vatAmount(UPDATED_VAT_AMOUNT)
            .vatPercentage(UPDATED_VAT_PERCENTAGE)
            .netAmount(UPDATED_NET_AMOUNT);

        restCostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCosts.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCosts))
            )
            .andExpect(status().isOk());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeUpdate);
        Costs testCosts = costsList.get(costsList.size() - 1);
        assertThat(testCosts.getDetail()).isEqualTo(UPDATED_DETAIL);
        assertThat(testCosts.getUnitPrice()).isEqualByComparingTo(UPDATED_UNIT_PRICE);
        assertThat(testCosts.getVatAmount()).isEqualByComparingTo(UPDATED_VAT_AMOUNT);
        assertThat(testCosts.getVatPercentage()).isEqualByComparingTo(UPDATED_VAT_PERCENTAGE);
        assertThat(testCosts.getNetAmount()).isEqualByComparingTo(UPDATED_NET_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingCosts() throws Exception {
        int databaseSizeBeforeUpdate = costsRepository.findAll().size();
        costs.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, costs.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(costs))
            )
            .andExpect(status().isBadRequest());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCosts() throws Exception {
        int databaseSizeBeforeUpdate = costsRepository.findAll().size();
        costs.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCostsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(costs))
            )
            .andExpect(status().isBadRequest());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCosts() throws Exception {
        int databaseSizeBeforeUpdate = costsRepository.findAll().size();
        costs.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCostsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(costs))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Costs in the database
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCosts() throws Exception {
        // Initialize the database
        costsRepository.saveAndFlush(costs);

        int databaseSizeBeforeDelete = costsRepository.findAll().size();

        // Delete the costs
        restCostsMockMvc
            .perform(delete(ENTITY_API_URL_ID, costs.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Costs> costsList = costsRepository.findAll();
        assertThat(costsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
