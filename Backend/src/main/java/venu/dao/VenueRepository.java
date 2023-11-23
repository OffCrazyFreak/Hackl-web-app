package venu.dao;

import venu.domain.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue, Long>  {
    int countById(Long id);
}
