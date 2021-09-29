package com.teamwill.rmkpro.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.teamwill.rmkpro.domain.enumeration.VehicleStatus;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Vehicle.
 */
@Entity
@Table(name = "vehicle")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Vehicle implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "registration_number", nullable = false)
    private String registrationNumber;

    @NotNull
    @Column(name = "first_registration_date", nullable = false)
    private LocalDate firstRegistrationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VehicleStatus status;

    @NotNull
    @Column(name = "mileage", nullable = false)
    private Integer mileage;

    @Column(name = "reserve_price", precision = 21, scale = 2)
    private BigDecimal reservePrice;

    @Column(name = "proposed_sale_price", precision = 21, scale = 2)
    private BigDecimal proposedSalePrice;

    @Column(name = "net_book_value", precision = 21, scale = 2)
    private BigDecimal netBookValue;

    @OneToMany(mappedBy = "vehicle")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "vehicle" }, allowSetters = true)
    private Set<VehicleImages> images = new HashSet<>();

    @OneToMany(mappedBy = "vehicle")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "vehicle" }, allowSetters = true)
    private Set<Costs> costs = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "model" }, allowSetters = true)
    private Trim trim;

    @ManyToOne
    @JsonIgnoreProperties(value = { "person", "company" }, allowSetters = true)
    private LegalEntity owner;

    @ManyToOne
    private Colour colour;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vehicle id(Long id) {
        this.id = id;
        return this;
    }

    public String getRegistrationNumber() {
        return this.registrationNumber;
    }

    public Vehicle registrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
        return this;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public LocalDate getFirstRegistrationDate() {
        return this.firstRegistrationDate;
    }

    public Vehicle firstRegistrationDate(LocalDate firstRegistrationDate) {
        this.firstRegistrationDate = firstRegistrationDate;
        return this;
    }

    public void setFirstRegistrationDate(LocalDate firstRegistrationDate) {
        this.firstRegistrationDate = firstRegistrationDate;
    }

    public VehicleStatus getStatus() {
        return this.status;
    }

    public Vehicle status(VehicleStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }

    public Integer getMileage() {
        return this.mileage;
    }

    public Vehicle mileage(Integer mileage) {
        this.mileage = mileage;
        return this;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public BigDecimal getReservePrice() {
        return this.reservePrice;
    }

    public Vehicle reservePrice(BigDecimal reservePrice) {
        this.reservePrice = reservePrice;
        return this;
    }

    public void setReservePrice(BigDecimal reservePrice) {
        this.reservePrice = reservePrice;
    }

    public BigDecimal getProposedSalePrice() {
        return this.proposedSalePrice;
    }

    public Vehicle proposedSalePrice(BigDecimal proposedSalePrice) {
        this.proposedSalePrice = proposedSalePrice;
        return this;
    }

    public void setProposedSalePrice(BigDecimal proposedSalePrice) {
        this.proposedSalePrice = proposedSalePrice;
    }

    public BigDecimal getNetBookValue() {
        return this.netBookValue;
    }

    public Vehicle netBookValue(BigDecimal netBookValue) {
        this.netBookValue = netBookValue;
        return this;
    }

    public void setNetBookValue(BigDecimal netBookValue) {
        this.netBookValue = netBookValue;
    }

    public Set<VehicleImages> getImages() {
        return this.images;
    }

    public Vehicle images(Set<VehicleImages> vehicleImages) {
        this.setImages(vehicleImages);
        return this;
    }

    public Vehicle addImages(VehicleImages vehicleImages) {
        this.images.add(vehicleImages);
        vehicleImages.setVehicle(this);
        return this;
    }

    public Vehicle removeImages(VehicleImages vehicleImages) {
        this.images.remove(vehicleImages);
        vehicleImages.setVehicle(null);
        return this;
    }

    public void setImages(Set<VehicleImages> vehicleImages) {
        if (this.images != null) {
            this.images.forEach(i -> i.setVehicle(null));
        }
        if (vehicleImages != null) {
            vehicleImages.forEach(i -> i.setVehicle(this));
        }
        this.images = vehicleImages;
    }

    public Set<Costs> getCosts() {
        return this.costs;
    }

    public Vehicle costs(Set<Costs> costs) {
        this.setCosts(costs);
        return this;
    }

    public Vehicle addCosts(Costs costs) {
        this.costs.add(costs);
        costs.setVehicle(this);
        return this;
    }

    public Vehicle removeCosts(Costs costs) {
        this.costs.remove(costs);
        costs.setVehicle(null);
        return this;
    }

    public void setCosts(Set<Costs> costs) {
        if (this.costs != null) {
            this.costs.forEach(i -> i.setVehicle(null));
        }
        if (costs != null) {
            costs.forEach(i -> i.setVehicle(this));
        }
        this.costs = costs;
    }

    public Trim getTrim() {
        return this.trim;
    }

    public Vehicle trim(Trim trim) {
        this.setTrim(trim);
        return this;
    }

    public void setTrim(Trim trim) {
        this.trim = trim;
    }

    public LegalEntity getOwner() {
        return this.owner;
    }

    public Vehicle owner(LegalEntity legalEntity) {
        this.setOwner(legalEntity);
        return this;
    }

    public void setOwner(LegalEntity legalEntity) {
        this.owner = legalEntity;
    }

    public Colour getColour() {
        return this.colour;
    }

    public Vehicle colour(Colour colour) {
        this.setColour(colour);
        return this;
    }

    public void setColour(Colour colour) {
        this.colour = colour;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vehicle)) {
            return false;
        }
        return id != null && id.equals(((Vehicle) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vehicle{" +
            "id=" + getId() +
            ", registrationNumber='" + getRegistrationNumber() + "'" +
            ", firstRegistrationDate='" + getFirstRegistrationDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", mileage=" + getMileage() +
            ", reservePrice=" + getReservePrice() +
            ", proposedSalePrice=" + getProposedSalePrice() +
            ", netBookValue=" + getNetBookValue() +
            "}";
    }
}
