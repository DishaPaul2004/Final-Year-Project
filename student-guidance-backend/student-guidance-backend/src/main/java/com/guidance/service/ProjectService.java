package com.guidance.service;

import com.guidance.model.Project;
import com.guidance.model.ProjectGroup;
import com.guidance.model.User;
import com.guidance.repository.ProjectRepository;
import com.guidance.repository.ProjectGroupRepository;
import com.guidance.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectGroupRepository groupRepository;

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByUserGroups(String email) {
        if (email == null || email.isBlank()) {
            System.out.println("email is null or email is blank");
            return List.of();
        }

        // Clean up text input whitespace and check fallback casings
        String sanitizedEmail = email.trim();
        User user = userRepository.findByEmail(sanitizedEmail);
        if (user == null) {
            System.out.println("user is null");
            user = userRepository.findByEmail(sanitizedEmail.toLowerCase());
        }

        // Graceful log check rather than dropping a 500 break on the client
        if (user == null) {
            System.out.println("Warning: No user found for email query: " + sanitizedEmail);
            return List.of();
        }

        List<ProjectGroup> userGroups = groupRepository.findActiveGroupsByUserId(user.getId());
        System.out.println("userGroups size: " + userGroups.size());

        // Map names to lowercase and trim any accidental whitespaces
        List<String> groupNames = userGroups.stream()
                .map(g -> g.getGroupName().toLowerCase().trim())
                .collect(Collectors.toList());
        System.out.println("groupNames: " + groupNames);

        if (groupNames.isEmpty()) {
            System.out.println("Warning: No group found for email query: " + sanitizedEmail);
            return List.of();
        }

        return projectRepository.findByGroupNameInIgnoreCase(groupNames);
    }

    public Optional<Project> getProjectById(Long id) {
        Optional<Project> projectOpt = projectRepository.findById(id);

        if (projectOpt.isPresent()) {
            Project project = projectOpt.get();

            // Find the group assigned to this project name
            groupRepository.findByGroupNameIgnoreCase(project.getGroupName()).ifPresent(group -> {
                User mentor = group.getMentor();

                if (mentor != null) {
                    // 1. Populate the transient mentor name string
                    project.setMentorName(mentor.getName());

                    // 2. Filter out the mentor from the members set by comparing IDs
                    Set<User> pureTeamMembers = group.getMembers().stream()
                            .filter(member -> !member.getId().equals(mentor.getId()))
                            .collect(Collectors.toSet());

                    project.setTeamMembers(pureTeamMembers);
                } else {
                    // Fallback if no mentor is attached to this group row
                    project.setTeamMembers(group.getMembers());
                }
            });
        }

        return projectOpt;
    }

    public Map<String, Object> getMentorshipSummary(String email) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> mentorsList = new ArrayList<>();
        List<Map<String, Object>> menteesList = new ArrayList<>();

        response.put("mentors", mentorsList);
        response.put("mentees", menteesList);

        if (email == null || email.isBlank()) {
            return response;
        }

        String sanitizedEmail = email.trim();
        User user = userRepository.findByEmail(sanitizedEmail);
        if (user == null) {
            user = userRepository.findByEmail(sanitizedEmail.toLowerCase());
        }
        if (user == null) {
            return response;
        }

        Long userId = user.getId();

        // 1. POPULATE MENTORS LIST
        List<ProjectGroup> studentGroups = groupRepository.findActiveGroupsByUserId(userId);
        for (ProjectGroup group : studentGroups) {
            if (group.getMentor() != null && !group.getMentor().getId().equals(userId)) {
                // Clean single-string lookup using the new repository method
                Project project = projectRepository.findByGroupNameIgnoreCase(group.getGroupName().trim()).orElse(null);

                if (project == null) {
                    continue;
                }

                List<String> otherMentees = group.getMembers().stream()
                        .filter(m -> !m.getId().equals(userId) && !m.getId().equals(group.getMentor().getId()))
                        .map(User::getName)
                        .collect(Collectors.toList());

                Map<String, Object> mentorMap = new HashMap<>();
                mentorMap.put("id", group.getId().toString());
                mentorMap.put("mentorName", group.getMentor().getName());
                mentorMap.put("otherMentees", otherMentees);

                // Safe fallbacks in case there's a character/space mismatch in the DB
                mentorMap.put("projectName", project != null ? project.getName() : group.getGroupName() + " (Project Entry Missing)");
                mentorMap.put("startDate", project != null ? project.getStartDate() : java.time.LocalDate.now());
                mentorMap.put("endDate", project != null ? project.getEndDate() : java.time.LocalDate.now().plusMonths(3));
                mentorMap.put("paymentStatus", "pending");

                mentorsList.add(mentorMap);
            }
        }

        // 2. POPULATE MENTEES LIST
        List<ProjectGroup> guidedGroups = groupRepository.findByMentorId(userId);
        for (ProjectGroup group : guidedGroups) {
            // Clean single-string lookup using the new repository method
            Project project = projectRepository.findByGroupNameIgnoreCase(group.getGroupName().trim()).orElse(null);

            if (project == null) {
                continue;
            }

            for (User studentMember : group.getMembers()) {
                if (studentMember.getId().equals(userId)) {
                    continue;
                }

                Map<String, Object> menteeMap = new HashMap<>();
                menteeMap.put("id", group.getId() + "-" + studentMember.getId());
                menteeMap.put("menteeName", studentMember.getName());

                // Safe fallbacks in case there's a character/space mismatch in the DB
                menteeMap.put("projectName", project != null ? project.getName() : group.getGroupName() + " (Project Entry Missing)");
                menteeMap.put("startDate", project != null ? project.getStartDate() : java.time.LocalDate.now());
                menteeMap.put("endDate", project != null ? project.getEndDate() : java.time.LocalDate.now().plusMonths(3));
                menteeMap.put("paymentStatus", "pending");

                menteesList.add(menteeMap);
            }
        }

        return response;
    }
}