package venu.service;

import venu.domain.Venue;

import java.util.List;

public interface VenueService {
    List<Venue> getVenues();
    List<Venue> saveAllVenues(List<Venue> venues);
    Venue addVenue(Venue venue);
    Venue updateVenue(Long id, Venue updatedVenue) throws NotFoundException;
    void deleteVenue(Long id);
    }
