package rpcc.service;

import rpcc.domain.Organization;

import java.util.List;

public interface OrganizationService {
    List<Organization> getOrganizations();
    List<Organization> saveAllOrganizations(List<Organization> organizations);
    Organization addOrganization(Organization organization);
    Organization updateOrganization(Long id, Organization updatedOrganization) throws NotFoundException;
    void deleteOrganization(Long id);
    }
