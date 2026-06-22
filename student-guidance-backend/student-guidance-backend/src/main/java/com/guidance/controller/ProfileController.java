//package com.guidance.controller;
//
//import com.guidance.model.Profile;
//import com.guidance.model.User;
//import com.guidance.service.ProfileService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@CrossOrigin(
//        origins = "http://localhost:8081",
//        allowedHeaders = "*",
//        exposedHeaders = "*",
//        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
//        allowCredentials = "true"
//)
//@RequestMapping("/api/my-profile")
////@CrossOrigin(origins = "http://localhost:8081") // adjust if needed
//public class ProfileController {
//
//    private final ProfileService profileService;
//
//    public ProfileController(ProfileService profileService) {
//        this.profileService = profileService;
//    }
//
//    // Save or update profile
//    @PostMapping("/save")
//    public ResponseEntity<Profile> saveProfile(@RequestParam String email, @RequestBody Profile profile) {
//        Profile savedProfile = profileService.saveOrUpdateProfile(email, profile);
//        return ResponseEntity.ok(savedProfile);
//    }
//
//    // Fetch profile by email
//    @GetMapping("/{email}")
//    public ResponseEntity<Profile> getProfile(@PathVariable String email) {
//        Optional<Profile> profileOpt = profileService.getProfileByEmail(email);
//
//        return profileOpt
//                .map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }
//}
package com.guidance.controller;

import com.guidance.model.Profile;
import com.guidance.model.User;
import com.guidance.repository.UserRepository; // Added import for user database queries
import com.guidance.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(
        origins = "http://localhost:8081",
        allowedHeaders = "*",
        exposedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowCredentials = "true"
)
@RequestMapping("/api/my-profile")
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository; // Added UserRepository reference

    // Updated constructor to support both profile services and direct user lookups
    public ProfileController(ProfileService profileService, UserRepository userRepository) {
        this.profileService = profileService;
        this.userRepository = userRepository;
    }

    // Save or update profile
    @PostMapping("/save")
    public ResponseEntity<Profile> saveProfile(@RequestParam String email, @RequestBody Profile profile) {
        Profile savedProfile = profileService.saveOrUpdateProfile(email, profile);
        return ResponseEntity.ok(savedProfile);
    }

    // Fetch profile by email
    @GetMapping("/{email}")
    public ResponseEntity<Profile> getProfile(@PathVariable String email) {
        Optional<Profile> profileOpt = profileService.getProfileByEmail(email);

        return profileOpt
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Fetch all registered users for group creation selections.
     * Accessible at: GET http://localhost:8080/api/my-profile/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            // Returns a 500 error down the pipeline if database connection faults happen
            return ResponseEntity.internalServerError().build();
        }
    }
}