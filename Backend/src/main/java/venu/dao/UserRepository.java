package venu.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import venu.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}

