package com.teamwill.rmkpro.repository;

import com.teamwill.rmkpro.domain.LegalEntity;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LegalEntity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LegalEntityRepository extends JpaRepository<LegalEntity, Long> {}
