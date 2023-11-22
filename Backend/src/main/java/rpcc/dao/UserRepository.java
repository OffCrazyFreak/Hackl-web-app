package rpcc.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import rpcc.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}

