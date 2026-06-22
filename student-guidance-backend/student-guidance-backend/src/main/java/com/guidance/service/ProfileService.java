package com.guidance.service;

import com.guidance.model.Profile;
import com.guidance.model.User;
import com.guidance.repository.ProfileRepository;
import com.guidance.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public Profile saveOrUpdateProfile(String email, Profile profileData) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByEmail(email));
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }

        User user = userOpt.get();

        // Find existing profile or create new one
        Optional<Profile> existing = profileRepository.findByUser(user);
        Profile profile = existing.orElse(new Profile());
        profile.setUser(user);

        // Update profile fields
        profile.setPhone(profileData.getPhone());
        profile.setBatch(profileData.getBatch());
        profile.setGithubLink(profileData.getGithubLink());
        profile.setLinkedinLink(profileData.getLinkedinLink());
        profile.setSkills(profileData.getSkills());
        profile.setExperiences(profileData.getExperiences());
        profile.setProfileImageUrl(profileData.getProfileImageUrl());

        // Save and return
        return profileRepository.save(profile);
    }

    public Optional<Profile> getProfileByEmail(String email) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByEmail(email));

        if (userOpt.isEmpty()) {
            return Optional.empty(); // return empty if user not found
        }

        User user = userOpt.get();
        return profileRepository.findByUser(user);
    }
}
