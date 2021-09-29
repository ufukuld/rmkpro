package com.teamwill.rmkpro.domain;

import com.teamwill.rmkpro.domain.enumeration.PaintType;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Colour.
 */
@Entity
@Table(name = "colour")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Colour implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "label", nullable = false)
    private String label;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "paint_type", nullable = false)
    private PaintType paintType;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Colour id(Long id) {
        this.id = id;
        return this;
    }

    public String getLabel() {
        return this.label;
    }

    public Colour label(String label) {
        this.label = label;
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public PaintType getPaintType() {
        return this.paintType;
    }

    public Colour paintType(PaintType paintType) {
        this.paintType = paintType;
        return this;
    }

    public void setPaintType(PaintType paintType) {
        this.paintType = paintType;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Colour)) {
            return false;
        }
        return id != null && id.equals(((Colour) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Colour{" +
            "id=" + getId() +
            ", label='" + getLabel() + "'" +
            ", paintType='" + getPaintType() + "'" +
            "}";
    }
}
