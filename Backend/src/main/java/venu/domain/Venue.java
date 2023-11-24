package venu.domain;

import jakarta.persistence.*;
import javax.validation.constraints.*;

@Entity
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Venue name is required")
    @Size(min = 2, max = 120, message = "Venue name must be between 2 and 120 characters")
    @Column(length = 120, nullable = false, unique = true)
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    // TODO: Add user 1-N venue so that each venue must have a user (moderator)

    // TODO: Make contact separate entity and make it venue 1-N contacts
    @NotEmpty(message = "Contact name is required")
    @Size(min = 2, max = 120, message = "Contact name must be between 2 and 120 characters")
    @Column(length = 120, nullable = false)
    private String contactName;

    @NotEmpty(message = "Contact email is required")
    @Email(message = "Invalid contact email")
    @Size(max = 120, message = "Contact email must be less than or equal to 120 characters")
    @Column(length = 120, nullable = false)
    private String contactEmail;

    @NotEmpty(message = "Contact tel is required")
    @Size(min = 2, max = 20, message = "Contact tel must be between 2 and 20 characters")
    @Column(length = 20, nullable = false)
    private String contactTel;

    @Size(max = 120, message = "Web URL must be less than or equal to 120 characters")
    @Column(length = 120)
    private String webUrl;

    @Size(max = 400, message = "Description must be under 400 characters")
    @Column(length = 400)
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactTel() {
        return contactTel;
    }

    public void setContactTel(String contactTel) {
        this.contactTel = contactTel;
    }

   public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getWebUrl() {
        return webUrl;
    }

    public void setWebUrl(String webUrl) {
        this.webUrl = webUrl;
    }
}
