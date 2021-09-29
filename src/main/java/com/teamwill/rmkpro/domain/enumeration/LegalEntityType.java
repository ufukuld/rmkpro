package com.teamwill.rmkpro.domain.enumeration;

/**
 * The LegalEntityType enumeration.
 */
public enum LegalEntityType {
    PRIVATE_INDIVIDUAL("Private Individual"),
    CORPORATION("Corporation");

    private final String value;

    LegalEntityType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
