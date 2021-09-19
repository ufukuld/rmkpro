package com.teamwill.rmkpro.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.teamwill.rmkpro.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LegalEntityTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LegalEntityType.class);
        LegalEntityType legalEntityType1 = new LegalEntityType();
        legalEntityType1.setId(1L);
        LegalEntityType legalEntityType2 = new LegalEntityType();
        legalEntityType2.setId(legalEntityType1.getId());
        assertThat(legalEntityType1).isEqualTo(legalEntityType2);
        legalEntityType2.setId(2L);
        assertThat(legalEntityType1).isNotEqualTo(legalEntityType2);
        legalEntityType1.setId(null);
        assertThat(legalEntityType1).isNotEqualTo(legalEntityType2);
    }
}
