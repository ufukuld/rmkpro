package com.teamwill.rmkpro.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.teamwill.rmkpro.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CostsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Costs.class);
        Costs costs1 = new Costs();
        costs1.setId(1L);
        Costs costs2 = new Costs();
        costs2.setId(costs1.getId());
        assertThat(costs1).isEqualTo(costs2);
        costs2.setId(2L);
        assertThat(costs1).isNotEqualTo(costs2);
        costs1.setId(null);
        assertThat(costs1).isNotEqualTo(costs2);
    }
}
