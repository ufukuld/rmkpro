package com.teamwill.rmkpro.repository;

import com.teamwill.rmkpro.domain.Colour;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Colour entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ColourRepository extends JpaRepository<Colour, Long> {}
