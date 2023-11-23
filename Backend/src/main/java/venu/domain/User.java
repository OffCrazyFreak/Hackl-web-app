package venu.domain;

import jakarta.persistence.*;
import javax.validation.constraints.*;

@Entity(name = "appUser")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 5, max = 20, message = "Username must be between 5 and 20 characters")
    @Column(length = 20, nullable = false, unique = true)
    private String username;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{12,20}$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character (!@#$%^&*()-_+=[]{}|/<>?~:;\"',.), and be between 12 and 20 characters")
    @Column(length = 20, nullable = false)
    private String password;

    // TODO: add authority enum (ADMINISTRATOR, MODERATOR, myb GUEST if needed)
    // ADMINISTRATOR manages users and spaces
    // MODERATOR manages reservations for spaces the ADMINISTRATOR assigned to them

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
