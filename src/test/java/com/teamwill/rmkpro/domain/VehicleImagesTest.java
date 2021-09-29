package com.teamwill.rmkpro.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.teamwill.rmkpro.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VehicleImagesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VehicleImages.class);
        VehicleImages vehicleImages1 = new VehicleImages();
        vehicleImages1.setId(1L);
        VehicleImages vehicleImages2 = new VehicleImages();
        vehicleImages2.setId(vehicleImages1.getId());
        assertThat(vehicleImages1).isEqualTo(vehicleImages2);
        vehicleImages2.setId(2L);
        assertThat(vehicleImages1).isNotEqualTo(vehicleImages2);
        vehicleImages1.setId(null);
        assertThat(vehicleImages1).isNotEqualTo(vehicleImages2);
    }
}
