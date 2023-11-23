package venu.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import venu.domain.Venue;
import venu.service.NotFoundException;
import venu.service.VenueService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {
    @Autowired
    private VenueService venueService;

    @GetMapping("")
    public  ResponseEntity<List<Venue>> getVenues() {
        List<Venue> venues = venueService.getVenues();
        return ResponseEntity.ok(venues);
    }

    @PostMapping("")
    public ResponseEntity<Venue> addVenue(@Valid @RequestBody Venue venue) {
        Venue addedVenue = venueService.addVenue(venue);
        if (addedVenue != null)
            return ResponseEntity.status(HttpStatus.CREATED).body(addedVenue);
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PostMapping("/import")
    public ResponseEntity<List<Venue>> importVenues(@RequestBody List<Venue> venues) {
        List<Venue> importedVenues = venueService.saveAllVenues(venues);
        if (importedVenues != null)
            return ResponseEntity.status(HttpStatus.CREATED).body(importedVenues);
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id, @Valid @RequestBody Venue updatedVenue) {
        try {
            Venue venue = venueService.updateVenue(id, updatedVenue);
            return ResponseEntity.ok(venue);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVenue(@PathVariable Long id) {
        try {
            venueService.deleteVenue(id);
            return ResponseEntity.ok("Venue deleted successfully");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Venue with ID " + id + " not found");
        }
    }

}
