package rpcc.service;

import rpcc.domain.User;

import java.util.List;

public interface UserService {
    List<User> getUsers();
    User getUserByUsername(String username);
    User createUser(User user);
    User updateUser(String username, User user);
    void deleteUser(String username);
}


