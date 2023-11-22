package rpcc.dao;

import rpcc.domain.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long>  {
    int countById(Long id);
}
