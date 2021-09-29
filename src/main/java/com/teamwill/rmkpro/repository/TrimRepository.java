package com.teamwill.rmkpro.repository;

import com.teamwill.rmkpro.domain.Trim;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Trim entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TrimRepository extends JpaRepository<Trim, Long> {
    @Query("from Trim t join fetch t.model m join fetch m.make")
    List<Trim> listWithModelAndMake();
}
