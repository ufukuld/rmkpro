package com.teamwill.rmkpro.domain.enumeration;

/**
 * The VehicleStatus enumeration.
 */
public enum VehicleStatus {
    REQ_FOR_COLLECTION("Collection Requested"),
    COLLECTED("Collected"),
    IN_AUCTION("In Auction"),
    SOLD("Sold");

    private final String value;

    VehicleStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
