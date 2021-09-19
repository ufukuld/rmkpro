package com.teamwill.rmkpro.repository;

import com.teamwill.rmkpro.domain.LegalEntityType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LegalEntityType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LegalEntityTypeRepository extends JpaRepository<LegalEntityType, Long> {}
