package venu.service;

import venu.domain.Venue;

import java.util.List;
import java.util.Optional;

public interface VenueService {
    List<Venue> getVenues();
    Venue getVenue(Long id);
    Venue addVenue(Venue venue);
    Venue updateVenue(Long id, Venue updatedVenue) throws NotFoundException;
    void deleteVenue(Long id);
    List<Venue> saveAllVenues(List<Venue> venues);
    }
