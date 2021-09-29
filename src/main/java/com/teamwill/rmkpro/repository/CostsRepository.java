package com.teamwill.rmkpro.repository;

import com.teamwill.rmkpro.domain.Costs;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Costs entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CostsRepository extends JpaRepository<Costs, Long> {}
