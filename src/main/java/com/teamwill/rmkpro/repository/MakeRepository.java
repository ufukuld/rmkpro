package com.teamwill.rmkpro.repository;

import com.teamwill.rmkpro.domain.Make;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Make entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MakeRepository extends JpaRepository<Make, Long> {}
