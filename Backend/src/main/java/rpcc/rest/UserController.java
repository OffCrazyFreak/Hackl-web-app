package rpcc.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rpcc.domain.User;
import rpcc.service.NotFoundException;
import rpcc.service.UserService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        String username = user.getUsername();
        if (userService.getUserByUsername(username) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with username " + user.getUsername() + " already exists");
        }

        try {
            User createdUser = userService.createUser(user);
            if (createdUser != null)
                return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
            else
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @PutMapping("/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @Valid @RequestBody User updatedUser) {
        if (!username.equals(updatedUser.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username in path does not match username in request body");
        }

        User existingUser = userService.getUserByUsername(username);
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with username " + username + "not found");
        }

        try {
            User user = userService.updateUser(username, updatedUser);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        try {
            userService.deleteUser(username);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

