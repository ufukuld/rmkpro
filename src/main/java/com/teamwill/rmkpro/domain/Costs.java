package com.teamwill.rmkpro.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Costs.
 */
@Entity
@Table(name = "costs")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Costs implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "detail", nullable = false)
    private String detail;

    @Column(name = "unit_price", precision = 21, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "vat_amount", precision = 21, scale = 2)
    private BigDecimal vatAmount;

    @Column(name = "vat_percentage", precision = 21, scale = 2)
    private BigDecimal vatPercentage;

    @Column(name = "net_amount", precision = 21, scale = 2)
    private BigDecimal netAmount;

    @ManyToOne
    @JsonIgnoreProperties(value = { "images", "costs", "trim", "owner", "colour" }, allowSetters = true)
    private Vehicle vehicle;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Costs id(Long id) {
        this.id = id;
        return this;
    }

    public String getDetail() {
        return this.detail;
    }

    public Costs detail(String detail) {
        this.detail = detail;
        return this;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public BigDecimal getUnitPrice() {
        return this.unitPrice;
    }

    public Costs unitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
        return this;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getVatAmount() {
        return this.vatAmount;
    }

    public Costs vatAmount(BigDecimal vatAmount) {
        this.vatAmount = vatAmount;
        return this;
    }

    public void setVatAmount(BigDecimal vatAmount) {
        this.vatAmount = vatAmount;
    }

    public BigDecimal getVatPercentage() {
        return this.vatPercentage;
    }

    public Costs vatPercentage(BigDecimal vatPercentage) {
        this.vatPercentage = vatPercentage;
        return this;
    }

    public void setVatPercentage(BigDecimal vatPercentage) {
        this.vatPercentage = vatPercentage;
    }

    public BigDecimal getNetAmount() {
        return this.netAmount;
    }

    public Costs netAmount(BigDecimal netAmount) {
        this.netAmount = netAmount;
        return this;
    }

    public void setNetAmount(BigDecimal netAmount) {
        this.netAmount = netAmount;
    }

    public Vehicle getVehicle() {
        return this.vehicle;
    }

    public Costs vehicle(Vehicle vehicle) {
        this.setVehicle(vehicle);
        return this;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Costs)) {
            return false;
        }
        return id != null && id.equals(((Costs) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Costs{" +
            "id=" + getId() +
            ", detail='" + getDetail() + "'" +
            ", unitPrice=" + getUnitPrice() +
            ", vatAmount=" + getVatAmount() +
            ", vatPercentage=" + getVatPercentage() +
            ", netAmount=" + getNetAmount() +
            "}";
    }
}
