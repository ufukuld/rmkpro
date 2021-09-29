package com.teamwill.rmkpro.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.teamwill.rmkpro.domain.enumeration.FuelType;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Trim.
 */
@Entity
@Table(name = "trim")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Trim implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "label", nullable = false)
    private String label;

    @NotNull
    @Column(name = "doors", nullable = false)
    private Integer doors;

    @NotNull
    @Column(name = "seats", nullable = false)
    private Integer seats;

    @NotNull
    @Column(name = "engine_displacement_cc", nullable = false)
    private Integer engineDisplacementCc;

    @Column(name = "is_automatic")
    private Boolean isAutomatic;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false)
    private FuelType fuelType;

    @ManyToOne
    //@JsonIgnoreProperties(value = { "make" }, allowSetters = true)
    private Model model;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Trim id(Long id) {
        this.id = id;
        return this;
    }

    public String getLabel() {
        return this.label;
    }

    public Trim label(String label) {
        this.label = label;
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Integer getDoors() {
        return this.doors;
    }

    public Trim doors(Integer doors) {
        this.doors = doors;
        return this;
    }

    public void setDoors(Integer doors) {
        this.doors = doors;
    }

    public Integer getSeats() {
        return this.seats;
    }

    public Trim seats(Integer seats) {
        this.seats = seats;
        return this;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    public Integer getEngineDisplacementCc() {
        return this.engineDisplacementCc;
    }

    public Trim engineDisplacementCc(Integer engineDisplacementCc) {
        this.engineDisplacementCc = engineDisplacementCc;
        return this;
    }

    public void setEngineDisplacementCc(Integer engineDisplacementCc) {
        this.engineDisplacementCc = engineDisplacementCc;
    }

    public Boolean getIsAutomatic() {
        return this.isAutomatic;
    }

    public Trim isAutomatic(Boolean isAutomatic) {
        this.isAutomatic = isAutomatic;
        return this;
    }

    public void setIsAutomatic(Boolean isAutomatic) {
        this.isAutomatic = isAutomatic;
    }

    public FuelType getFuelType() {
        return this.fuelType;
    }

    public Trim fuelType(FuelType fuelType) {
        this.fuelType = fuelType;
        return this;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public Model getModel() {
        return this.model;
    }

    public Trim model(Model model) {
        this.setModel(model);
        return this;
    }

    public void setModel(Model model) {
        this.model = model;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Trim)) {
            return false;
        }
        return id != null && id.equals(((Trim) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Trim{" +
            "id=" + getId() +
            ", label='" + getLabel() + "'" +
            ", doors=" + getDoors() +
            ", seats=" + getSeats() +
            ", engineDisplacementCc=" + getEngineDisplacementCc() +
            ", isAutomatic='" + getIsAutomatic() + "'" +
            ", fuelType='" + getFuelType() + "'" +
            "}";
    }
}
