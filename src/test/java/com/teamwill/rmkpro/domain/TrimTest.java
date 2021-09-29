package com.teamwill.rmkpro.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.teamwill.rmkpro.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TrimTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Trim.class);
        Trim trim1 = new Trim();
        trim1.setId(1L);
        Trim trim2 = new Trim();
        trim2.setId(trim1.getId());
        assertThat(trim1).isEqualTo(trim2);
        trim2.setId(2L);
        assertThat(trim1).isNotEqualTo(trim2);
        trim1.setId(null);
        assertThat(trim1).isNotEqualTo(trim2);
    }
}
