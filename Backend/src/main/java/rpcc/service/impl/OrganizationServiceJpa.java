package rpcc.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import rpcc.dao.OrganizationRepository;
import rpcc.domain.Organization;
import rpcc.service.NotFoundException;
import rpcc.service.OrganizationService;

import java.util.List;

@Service
public class OrganizationServiceJpa implements OrganizationService {
    @Autowired
    private OrganizationRepository organizationRepo;

    @Override
    public List<Organization> getOrganizations() {
        return organizationRepo.findAll();
    }

    @Override
    public Organization addOrganization(Organization organization) {
        Assert.notNull(organization, "Organization object must be given.");

        return organizationRepo.save(organization);
    }

    @Override
    public List<Organization> saveAllOrganizations(List<Organization> organizations) {
        return organizationRepo.saveAll(organizations);
    }

    @Override
    public Organization updateOrganization(Long id, Organization updatedOrganization) throws NotFoundException {
        Organization organization = organizationRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Organization with ID " + id + " not found"));

        // Update the organization attributes with the values from the updatedOrganization object
        organization.setName(updatedOrganization.getName());
        organization.setDescription(updatedOrganization.getDescription());
        organization.setContactName(updatedOrganization.getContactName());
        organization.setContactEmail(updatedOrganization.getContactEmail());
        organization.setContactTel(updatedOrganization.getContactTel());
        organization.setReferences(updatedOrganization.getReferences());
        organization.setLookingFor(updatedOrganization.getLookingFor());
        organization.setAddress(updatedOrganization.getAddress());
        organization.setWebUrl(updatedOrganization.getWebUrl());
        organization.setFacebookUrl(updatedOrganization.getFacebookUrl());
        organization.setInstagramUrl(updatedOrganization.getInstagramUrl());
        organization.setLinkedInUrl(updatedOrganization.getLinkedInUrl());
        organization.setLegalStatus(updatedOrganization.getLegalStatus());
        organization.setWorkDomainIncludesScience(updatedOrganization.getWorkDomainIncludesScience());
        organization.setWorkDomainIncludesTechnology(updatedOrganization.getWorkDomainIncludesTechnology());
        organization.setWorkDomainIncludesEcology(updatedOrganization.getWorkDomainIncludesEcology());
        organization.setWorkDomainIncludesArt(updatedOrganization.getWorkDomainIncludesArt());
        organization.setWorkDomainIncludesCrafts(updatedOrganization.getWorkDomainIncludesCrafts());

        return organizationRepo.save(organization);
    }

    @Override
    public void deleteOrganization(Long id) {
        if (!organizationRepo.existsById(id)) {
            throw new NotFoundException("Organization with id " + id + " not found.");
        }

        organizationRepo.deleteById(id);
    }

}
