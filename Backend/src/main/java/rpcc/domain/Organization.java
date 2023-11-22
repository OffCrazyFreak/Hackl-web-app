package rpcc.domain;

import jakarta.persistence.*;
import javax.validation.constraints.*;

@Entity
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Organization name is required")
    @Size(min = 2, max = 120, message = "Organization name must be between 2 and 120 characters")
    @Column(length = 120, nullable = false, unique = true)
    private String name;

    @NotEmpty(message = "Description is required")
    @Size(min = 2, max = 2000, message = "Description must be between 2 and 2000 characters")
    @Column(length = 2000, nullable = false)
    private String description;

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

    @Column(name = "\"references\"", length = 2000) // references is a reserved word in PostgreSQL
    @Size(max = 2000, message = "References must be less than or equal to 2000 characters")
    private String references;

    @Size(max = 2000, message = "Looking for must be less than or equal to 2000 characters")
    @Column(length = 2000)
    private String lookingFor;

    @NotBlank(message = "Address is required")
    private String address;

    @Size(max = 120, message = "Web URL must be less than or equal to 120 characters")
    @Column(length = 120)
    private String webUrl;

    @Size(max = 120, message = "Facebook URL must be less than or equal to 120 characters")
    @Column(length = 120)
    private String facebookUrl;

    @Size(max = 120, message = "Instagram URL must be less than or equal to 120 characters")
    @Column(length = 120)
    private String instagramUrl;

    @Size(max = 120, message = "LinkedIn URL must be less than or equal to 120 characters")
    @Column(length = 120)
    private String linkedInUrl;

    @NotBlank(message = "Legal status is required")
    @Pattern(regexp = "^(For-profit|Non-profit|Individual)$", message = "Invalid legal status")
    @Column(length = 20, nullable = false)
    private String legalStatus;

    @NotNull
    @Column(nullable = false)
    private Boolean workDomainIncludesScience;

    @NotNull
    @Column(nullable = false)
    private Boolean workDomainIncludesTechnology;

    @NotNull
    @Column(nullable = false)
    private Boolean workDomainIncludesEcology;

    @NotNull
    @Column(nullable = false)
    private Boolean workDomainIncludesArt;

    @NotNull
    @Column(nullable = false)
    private Boolean workDomainIncludesCrafts;

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

    public String getReferences() {
        return references;
    }

    public void setReferences(String references) {
        this.references = references;
    }

    public String getLookingFor() {
        return lookingFor;
    }

    public void setLookingFor(String lookingFor) {
        this.lookingFor = lookingFor;
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

    public String getFacebookUrl() {
        return facebookUrl;
    }

    public void setFacebookUrl(String facebookUrl) {
        this.facebookUrl = facebookUrl;
    }

    public String getInstagramUrl() {
        return instagramUrl;
    }

    public void setInstagramUrl(String instagramUrl) {
        this.instagramUrl = instagramUrl;
    }

    public String getLinkedInUrl() {
        return linkedInUrl;
    }

    public void setLinkedInUrl(String linkedInUrl) {
        this.linkedInUrl = linkedInUrl;
    }

    public String getLegalStatus() {
        return legalStatus;
    }

    public void setLegalStatus(String legalStatus) {
        this.legalStatus = legalStatus;
    }

    public Boolean getWorkDomainIncludesScience() {
        return workDomainIncludesScience;
    }

    public void setWorkDomainIncludesScience(Boolean workDomainIncludesScience) {
        this.workDomainIncludesScience = workDomainIncludesScience;
    }

    public Boolean getWorkDomainIncludesTechnology() {
        return workDomainIncludesTechnology;
    }

    public void setWorkDomainIncludesTechnology(Boolean workDomainIncludesTechnology) {
        this.workDomainIncludesTechnology = workDomainIncludesTechnology;
    }

    public Boolean getWorkDomainIncludesEcology() {
        return workDomainIncludesEcology;
    }

    public void setWorkDomainIncludesEcology(Boolean workDomainIncludesEcology) {
        this.workDomainIncludesEcology = workDomainIncludesEcology;
    }

    public Boolean getWorkDomainIncludesArt() {
        return workDomainIncludesArt;
    }

    public void setWorkDomainIncludesArt(Boolean workDomainIncludesArt) {
        this.workDomainIncludesArt = workDomainIncludesArt;
    }

    public Boolean getWorkDomainIncludesCrafts() {
        return workDomainIncludesCrafts;
    }

    public void setWorkDomainIncludesCrafts(Boolean workDomainIncludesCrafts) {
        this.workDomainIncludesCrafts = workDomainIncludesCrafts;
    }
}
