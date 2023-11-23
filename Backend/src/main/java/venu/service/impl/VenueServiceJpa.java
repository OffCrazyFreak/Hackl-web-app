package venu.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import venu.dao.VenueRepository;
import venu.domain.Venue;
import venu.service.NotFoundException;
import venu.service.VenueService;

import java.util.List;

@Service
public class VenueServiceJpa implements VenueService {
    @Autowired
    private VenueRepository venueRepo;

    @Override
    public List<Venue> getVenues() {
        return venueRepo.findAll();
    }

    @Override
    public Venue addVenue(Venue venue) {
        Assert.notNull(venue, "Venue object must be given.");

        return venueRepo.save(venue);
    }

    @Override
    public List<Venue> saveAllVenues(List<Venue> venues) {
        return venueRepo.saveAll(venues);
    }

    @Override
    public Venue updateVenue(Long id, Venue updatedVenue) throws NotFoundException {
        Venue venue = venueRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Venue with ID " + id + " not found"));

        // Update the venue attributes with the values from the updatedVenue object
        venue.setName(updatedVenue.getName());
        venue.setDescription(updatedVenue.getDescription());
        venue.setContactName(updatedVenue.getContactName());
        venue.setContactEmail(updatedVenue.getContactEmail());
        venue.setContactTel(updatedVenue.getContactTel());
        venue.setAddress(updatedVenue.getAddress());
        venue.setWebUrl(updatedVenue.getWebUrl());

        return venueRepo.save(venue);
    }

    @Override
    public void deleteVenue(Long id) {
        if (!venueRepo.existsById(id)) {
            throw new NotFoundException("Venue with id " + id + " not found.");
        }

        venueRepo.deleteById(id);
    }

}
