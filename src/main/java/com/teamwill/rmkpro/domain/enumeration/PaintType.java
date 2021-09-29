package com.teamwill.rmkpro.domain.enumeration;

/**
 * The PaintType enumeration.
 */
public enum PaintType {
    SOLID("Solid"),
    METALLIC("Metallic"),
    PEARLESCENT("Pearlescent"),
    MATTE("Matte"),
    SPECIAL("Special/Other");

    private final String value;

    PaintType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
