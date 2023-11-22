package rpcc.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import rpcc.dao.UserRepository;
import rpcc.domain.User;
import rpcc.service.NotFoundException;
import rpcc.service.UserService;

import java.util.List;

@Service
public class UserServiceJpa implements UserService {
    @Autowired
    private UserRepository userRepo;

    @Override
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    @Override
    public User createUser(User user) {
        Assert.notNull(user, "User object must be given.");
        validateUser(user);
        return userRepo.save(user);
    }

    @Override
    public User updateUser(String username, User updatedUser) {
        User user = userRepo.findByUsername(username);
        validateUser(updatedUser);
        if (user != null) {
            user.setPassword(updatedUser.getPassword());
            return userRepo.save(user);
        } else {
            throw new NotFoundException("User with username " + username + " not found.");
        }
    }

    @Override
    public void deleteUser(String username) {
        User user = userRepo.findByUsername(username);
        if (user != null) {
            userRepo.delete(user);
        } else {
            throw new NotFoundException("User with username " + username + " not found.");
        }
    }

    private void validateUser(User user) {
        // Validate the username
        if (user.getUsername().length() < 6 || user.getUsername().length() > 20) {
            throw new IllegalArgumentException("Username must be between 6 and 20 characters");
        }

        // Validate the password using the regex pattern
        String passwordPattern = "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{12,20}$";
        if (!user.getPassword().matches(passwordPattern)) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter, one lowercase letter, one number, one special character (!@#$%^&*()-_+=[]{}|/<>?~:;\\\"',.), and be between 12 and 20 characters");
        }
    }
}


