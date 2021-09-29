package com.teamwill.rmkpro.repository;

import com.teamwill.rmkpro.domain.VehicleImages;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the VehicleImages entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VehicleImagesRepository extends JpaRepository<VehicleImages, Long> {}
