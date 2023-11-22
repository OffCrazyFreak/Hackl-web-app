package rpcc.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rpcc.domain.Organization;
import rpcc.service.NotFoundException;
import rpcc.service.OrganizationService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {
    @Autowired
    private OrganizationService organizationService;

    @GetMapping("")
    public  ResponseEntity<List<Organization>> getOrganizations() {
        List<Organization> organizations = organizationService.getOrganizations();
        return ResponseEntity.ok(organizations);
    }

    @PostMapping("")
    public ResponseEntity<Organization> addOrganization(@Valid @RequestBody Organization organization) {
        Organization addedOrganization = organizationService.addOrganization(organization);
        if (addedOrganization != null)
            return ResponseEntity.status(HttpStatus.CREATED).body(addedOrganization);
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PostMapping("/import")
    public ResponseEntity<List<Organization>> importOrganizations(@RequestBody List<Organization> organizations) {
        List<Organization> importedOrganizations = organizationService.saveAllOrganizations(organizations);
        if (importedOrganizations != null)
            return ResponseEntity.status(HttpStatus.CREATED).body(importedOrganizations);
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organization> updateOrganization(@PathVariable Long id, @Valid @RequestBody Organization updatedOrganization) {
        try {
            Organization organization = organizationService.updateOrganization(id, updatedOrganization);
            return ResponseEntity.ok(organization);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrganization(@PathVariable Long id) {
        try {
            organizationService.deleteOrganization(id);
            return ResponseEntity.ok("Organization deleted successfully");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organization with ID " + id + " not found");
        }
    }

}
