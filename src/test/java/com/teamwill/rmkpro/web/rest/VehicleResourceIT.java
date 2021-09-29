package com.teamwill.rmkpro.web.rest;

import static com.teamwill.rmkpro.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.teamwill.rmkpro.IntegrationTest;
import com.teamwill.rmkpro.domain.Vehicle;
import com.teamwill.rmkpro.domain.enumeration.VehicleStatus;
import com.teamwill.rmkpro.repository.VehicleRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link VehicleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VehicleResourceIT {

    private static final String DEFAULT_REGISTRATION_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_REGISTRATION_NUMBER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_FIRST_REGISTRATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FIRST_REGISTRATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final VehicleStatus DEFAULT_STATUS = VehicleStatus.REQ_FOR_COLLECTION;
    private static final VehicleStatus UPDATED_STATUS = VehicleStatus.COLLECTED;

    private static final Integer DEFAULT_MILEAGE = 1;
    private static final Integer UPDATED_MILEAGE = 2;

    private static final BigDecimal DEFAULT_RESERVE_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_RESERVE_PRICE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_PROPOSED_SALE_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PROPOSED_SALE_PRICE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_NET_BOOK_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_NET_BOOK_VALUE = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/vehicles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVehicleMockMvc;

    private Vehicle vehicle;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vehicle createEntity(EntityManager em) {
        Vehicle vehicle = new Vehicle()
            .registrationNumber(DEFAULT_REGISTRATION_NUMBER)
            .firstRegistrationDate(DEFAULT_FIRST_REGISTRATION_DATE)
            .status(DEFAULT_STATUS)
            .mileage(DEFAULT_MILEAGE)
            .reservePrice(DEFAULT_RESERVE_PRICE)
            .proposedSalePrice(DEFAULT_PROPOSED_SALE_PRICE)
            .netBookValue(DEFAULT_NET_BOOK_VALUE);
        return vehicle;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vehicle createUpdatedEntity(EntityManager em) {
        Vehicle vehicle = new Vehicle()
            .registrationNumber(UPDATED_REGISTRATION_NUMBER)
            .firstRegistrationDate(UPDATED_FIRST_REGISTRATION_DATE)
            .status(UPDATED_STATUS)
            .mileage(UPDATED_MILEAGE)
            .reservePrice(UPDATED_RESERVE_PRICE)
            .proposedSalePrice(UPDATED_PROPOSED_SALE_PRICE)
            .netBookValue(UPDATED_NET_BOOK_VALUE);
        return vehicle;
    }

    @BeforeEach
    public void initTest() {
        vehicle = createEntity(em);
    }

    @Test
    @Transactional
    void createVehicle() throws Exception {
        int databaseSizeBeforeCreate = vehicleRepository.findAll().size();
        // Create the Vehicle
        restVehicleMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isCreated());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeCreate + 1);
        Vehicle testVehicle = vehicleList.get(vehicleList.size() - 1);
        assertThat(testVehicle.getRegistrationNumber()).isEqualTo(DEFAULT_REGISTRATION_NUMBER);
        assertThat(testVehicle.getFirstRegistrationDate()).isEqualTo(DEFAULT_FIRST_REGISTRATION_DATE);
        assertThat(testVehicle.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testVehicle.getMileage()).isEqualTo(DEFAULT_MILEAGE);
        assertThat(testVehicle.getReservePrice()).isEqualByComparingTo(DEFAULT_RESERVE_PRICE);
        assertThat(testVehicle.getProposedSalePrice()).isEqualByComparingTo(DEFAULT_PROPOSED_SALE_PRICE);
        assertThat(testVehicle.getNetBookValue()).isEqualByComparingTo(DEFAULT_NET_BOOK_VALUE);
    }

    @Test
    @Transactional
    void createVehicleWithExistingId() throws Exception {
        // Create the Vehicle with an existing ID
        vehicle.setId(1L);

        int databaseSizeBeforeCreate = vehicleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVehicleMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRegistrationNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = vehicleRepository.findAll().size();
        // set the field null
        vehicle.setRegistrationNumber(null);

        // Create the Vehicle, which fails.

        restVehicleMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isBadRequest());

        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkFirstRegistrationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = vehicleRepository.findAll().size();
        // set the field null
        vehicle.setFirstRegistrationDate(null);

        // Create the Vehicle, which fails.

        restVehicleMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isBadRequest());

        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMileageIsRequired() throws Exception {
        int databaseSizeBeforeTest = vehicleRepository.findAll().size();
        // set the field null
        vehicle.setMileage(null);

        // Create the Vehicle, which fails.

        restVehicleMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isBadRequest());

        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVehicles() throws Exception {
        // Initialize the database
        vehicleRepository.saveAndFlush(vehicle);

        // Get all the vehicleList
        restVehicleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vehicle.getId().intValue())))
            .andExpect(jsonPath("$.[*].registrationNumber").value(hasItem(DEFAULT_REGISTRATION_NUMBER)))
            .andExpect(jsonPath("$.[*].firstRegistrationDate").value(hasItem(DEFAULT_FIRST_REGISTRATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].mileage").value(hasItem(DEFAULT_MILEAGE)))
            .andExpect(jsonPath("$.[*].reservePrice").value(hasItem(sameNumber(DEFAULT_RESERVE_PRICE))))
            .andExpect(jsonPath("$.[*].proposedSalePrice").value(hasItem(sameNumber(DEFAULT_PROPOSED_SALE_PRICE))))
            .andExpect(jsonPath("$.[*].netBookValue").value(hasItem(sameNumber(DEFAULT_NET_BOOK_VALUE))));
    }

    @Test
    @Transactional
    void getVehicle() throws Exception {
        // Initialize the database
        vehicleRepository.saveAndFlush(vehicle);

        // Get the vehicle
        restVehicleMockMvc
            .perform(get(ENTITY_API_URL_ID, vehicle.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vehicle.getId().intValue()))
            .andExpect(jsonPath("$.registrationNumber").value(DEFAULT_REGISTRATION_NUMBER))
            .andExpect(jsonPath("$.firstRegistrationDate").value(DEFAULT_FIRST_REGISTRATION_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.mileage").value(DEFAULT_MILEAGE))
            .andExpect(jsonPath("$.reservePrice").value(sameNumber(DEFAULT_RESERVE_PRICE)))
            .andExpect(jsonPath("$.proposedSalePrice").value(sameNumber(DEFAULT_PROPOSED_SALE_PRICE)))
            .andExpect(jsonPath("$.netBookValue").value(sameNumber(DEFAULT_NET_BOOK_VALUE)));
    }

    @Test
    @Transactional
    void getNonExistingVehicle() throws Exception {
        // Get the vehicle
        restVehicleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVehicle() throws Exception {
        // Initialize the database
        vehicleRepository.saveAndFlush(vehicle);

        int databaseSizeBeforeUpdate = vehicleRepository.findAll().size();

        // Update the vehicle
        Vehicle updatedVehicle = vehicleRepository.findById(vehicle.getId()).get();
        // Disconnect from session so that the updates on updatedVehicle are not directly saved in db
        em.detach(updatedVehicle);
        updatedVehicle
            .registrationNumber(UPDATED_REGISTRATION_NUMBER)
            .firstRegistrationDate(UPDATED_FIRST_REGISTRATION_DATE)
            .status(UPDATED_STATUS)
            .mileage(UPDATED_MILEAGE)
            .reservePrice(UPDATED_RESERVE_PRICE)
            .proposedSalePrice(UPDATED_PROPOSED_SALE_PRICE)
            .netBookValue(UPDATED_NET_BOOK_VALUE);

        restVehicleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVehicle.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVehicle))
            )
            .andExpect(status().isOk());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeUpdate);
        Vehicle testVehicle = vehicleList.get(vehicleList.size() - 1);
        assertThat(testVehicle.getRegistrationNumber()).isEqualTo(UPDATED_REGISTRATION_NUMBER);
        assertThat(testVehicle.getFirstRegistrationDate()).isEqualTo(UPDATED_FIRST_REGISTRATION_DATE);
        assertThat(testVehicle.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testVehicle.getMileage()).isEqualTo(UPDATED_MILEAGE);
        assertThat(testVehicle.getReservePrice()).isEqualTo(UPDATED_RESERVE_PRICE);
        assertThat(testVehicle.getProposedSalePrice()).isEqualTo(UPDATED_PROPOSED_SALE_PRICE);
        assertThat(testVehicle.getNetBookValue()).isEqualTo(UPDATED_NET_BOOK_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingVehicle() throws Exception {
        int databaseSizeBeforeUpdate = vehicleRepository.findAll().size();
        vehicle.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehicleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vehicle.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVehicle() throws Exception {
        int databaseSizeBeforeUpdate = vehicleRepository.findAll().size();
        vehicle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVehicle() throws Exception {
        int databaseSizeBeforeUpdate = vehicleRepository.findAll().size();
        vehicle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVehicleWithPatch() throws Exception {
        // Initialize the database
        vehicleRepository.saveAndFlush(vehicle);

        int databaseSizeBeforeUpdate = vehicleRepository.findAll().size();

        // Update the vehicle using partial update
        Vehicle partialUpdatedVehicle = new Vehicle();
        partialUpdatedVehicle.setId(vehicle.getId());

        partialUpdatedVehicle.mileage(UPDATED_MILEAGE).reservePrice(UPDATED_RESERVE_PRICE).netBookValue(UPDATED_NET_BOOK_VALUE);

        restVehicleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehicle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVehicle))
            )
            .andExpect(status().isOk());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeUpdate);
        Vehicle testVehicle = vehicleList.get(vehicleList.size() - 1);
        assertThat(testVehicle.getRegistrationNumber()).isEqualTo(DEFAULT_REGISTRATION_NUMBER);
        assertThat(testVehicle.getFirstRegistrationDate()).isEqualTo(DEFAULT_FIRST_REGISTRATION_DATE);
        assertThat(testVehicle.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testVehicle.getMileage()).isEqualTo(UPDATED_MILEAGE);
        assertThat(testVehicle.getReservePrice()).isEqualByComparingTo(UPDATED_RESERVE_PRICE);
        assertThat(testVehicle.getProposedSalePrice()).isEqualByComparingTo(DEFAULT_PROPOSED_SALE_PRICE);
        assertThat(testVehicle.getNetBookValue()).isEqualByComparingTo(UPDATED_NET_BOOK_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateVehicleWithPatch() throws Exception {
        // Initialize the database
        vehicleRepository.saveAndFlush(vehicle);

        int databaseSizeBeforeUpdate = vehicleRepository.findAll().size();

        // Update the vehicle using partial update
        Vehicle partialUpdatedVehicle = new Vehicle();
        partialUpdatedVehicle.setId(vehicle.getId());

        partialUpdatedVehicle
            .registrationNumber(UPDATED_REGISTRATION_NUMBER)
            .firstRegistrationDate(UPDATED_FIRST_REGISTRATION_DATE)
            .status(UPDATED_STATUS)
            .mileage(UPDATED_MILEAGE)
            .reservePrice(UPDATED_RESERVE_PRICE)
            .proposedSalePrice(UPDATED_PROPOSED_SALE_PRICE)
            .netBookValue(UPDATED_NET_BOOK_VALUE);

        restVehicleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehicle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVehicle))
            )
            .andExpect(status().isOk());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeUpdate);
        Vehicle testVehicle = vehicleList.get(vehicleList.size() - 1);
        assertThat(testVehicle.getRegistrationNumber()).isEqualTo(UPDATED_REGISTRATION_NUMBER);
        assertThat(testVehicle.getFirstRegistrationDate()).isEqualTo(UPDATED_FIRST_REGISTRATION_DATE);
        assertThat(testVehicle.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testVehicle.getMileage()).isEqualTo(UPDATED_MILEAGE);
        assertThat(testVehicle.getReservePrice()).isEqualByComparingTo(UPDATED_RESERVE_PRICE);
        assertThat(testVehicle.getProposedSalePrice()).isEqualByComparingTo(UPDATED_PROPOSED_SALE_PRICE);
        assertThat(testVehicle.getNetBookValue()).isEqualByComparingTo(UPDATED_NET_BOOK_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingVehicle() throws Exception {
        int databaseSizeBeforeUpdate = vehicleRepository.findAll().size();
        vehicle.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehicleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vehicle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVehicle() throws Exception {
        int databaseSizeBeforeUpdate = vehicleRepository.findAll().size();
        vehicle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVehicle() throws Exception {
        int databaseSizeBeforeUpdate = vehicleRepository.findAll().size();
        vehicle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehicleMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vehicle))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vehicle in the database
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVehicle() throws Exception {
        // Initialize the database
        vehicleRepository.saveAndFlush(vehicle);

        int databaseSizeBeforeDelete = vehicleRepository.findAll().size();

        // Delete the vehicle
        restVehicleMockMvc
            .perform(delete(ENTITY_API_URL_ID, vehicle.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vehicle> vehicleList = vehicleRepository.findAll();
        assertThat(vehicleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
