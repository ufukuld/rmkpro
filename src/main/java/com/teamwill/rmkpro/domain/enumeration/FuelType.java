package com.teamwill.rmkpro.domain.enumeration;

/**
 * The FuelType enumeration.
 */
public enum FuelType {
    PETROL("Petrol"),
    DIESEL("Diesel"),
    PETROL_HYBRID("Petrol Hybrid"),
    ELECTRIC("Electric");

    private final String value;

    FuelType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
