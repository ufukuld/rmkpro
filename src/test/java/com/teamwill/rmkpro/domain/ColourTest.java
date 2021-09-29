package com.teamwill.rmkpro.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.teamwill.rmkpro.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ColourTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Colour.class);
        Colour colour1 = new Colour();
        colour1.setId(1L);
        Colour colour2 = new Colour();
        colour2.setId(colour1.getId());
        assertThat(colour1).isEqualTo(colour2);
        colour2.setId(2L);
        assertThat(colour1).isNotEqualTo(colour2);
        colour1.setId(null);
        assertThat(colour1).isNotEqualTo(colour2);
    }
}
