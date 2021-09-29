package com.teamwill.rmkpro.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.teamwill.rmkpro.domain.enumeration.LegalEntityType;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LegalEntity.
 */
@Entity
@Table(name = "legal_entity")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class LegalEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "post_code", nullable = false)
    private String postCode;

    @NotNull
    @Column(name = "street_address", nullable = false)
    private String streetAddress;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private LegalEntityType type;

    @OneToOne
    @JoinColumn(unique = true)
    private Person person;

    @JsonIgnoreProperties(value = { "contactPerson" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LegalEntity id(Long id) {
        this.id = id;
        return this;
    }

    public String getPostCode() {
        return this.postCode;
    }

    public LegalEntity postCode(String postCode) {
        this.postCode = postCode;
        return this;
    }

    public void setPostCode(String postCode) {
        this.postCode = postCode;
    }

    public String getStreetAddress() {
        return this.streetAddress;
    }

    public LegalEntity streetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
        return this;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getEmail() {
        return this.email;
    }

    public LegalEntity email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public LegalEntity phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LegalEntityType getType() {
        return this.type;
    }

    public LegalEntity type(LegalEntityType type) {
        this.type = type;
        return this;
    }

    public void setType(LegalEntityType type) {
        this.type = type;
    }

    public Person getPerson() {
        return this.person;
    }

    public LegalEntity person(Person person) {
        this.setPerson(person);
        return this;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Company getCompany() {
        return this.company;
    }

    public LegalEntity company(Company company) {
        this.setCompany(company);
        return this;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LegalEntity)) {
            return false;
        }
        return id != null && id.equals(((LegalEntity) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LegalEntity{" +
            "id=" + getId() +
            ", postCode='" + getPostCode() + "'" +
            ", streetAddress='" + getStreetAddress() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
