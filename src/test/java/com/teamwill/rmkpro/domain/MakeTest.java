package com.teamwill.rmkpro.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.teamwill.rmkpro.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MakeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Make.class);
        Make make1 = new Make();
        make1.setId(1L);
        Make make2 = new Make();
        make2.setId(make1.getId());
        assertThat(make1).isEqualTo(make2);
        make2.setId(2L);
        assertThat(make1).isNotEqualTo(make2);
        make1.setId(null);
        assertThat(make1).isNotEqualTo(make2);
    }
}
