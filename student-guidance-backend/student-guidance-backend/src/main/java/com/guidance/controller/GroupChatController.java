package com.guidance.controller;

import com.guidance.model.*;
import com.guidance.repository.ProfileRepository;
import com.guidance.service.ProjectGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")
@RequestMapping("/api/group-chat")
public class GroupChatController {

    private final ProjectGroupService groupService;
    private final ProfileRepository profileRepository;

    public GroupChatController(ProjectGroupService groupService, ProfileRepository profileRepository) {
        this.groupService = groupService;
        this.profileRepository = profileRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<ProjectGroup> createGroup(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("groupName");
        String techStack = (String) payload.get("techStack");
        List<Integer> memberIdsInt = (List<Integer>) payload.get("memberIds");
        String creatorEmail = (String) payload.get("creatorEmail");

        Set<Long> memberIds = memberIdsInt.stream().map(Integer::longValue).collect(java.util.stream.Collectors.toSet());
        return ResponseEntity.ok(groupService.createGroup(name, techStack, memberIds, creatorEmail));
    }

    @GetMapping("/my-groups")
    public ResponseEntity<List<ProjectGroup>> getMyGroups(@RequestParam String email) {
        return ResponseEntity.ok(groupService.getUserGroups(email));
    }

//    @GetMapping("/potential-mentors/{groupId}")
//    public ResponseEntity<List<User>> getPotentialMentors(@PathVariable Long groupId) {
//        return ResponseEntity.ok(groupService.getPotentialMentors(groupId));
//    }

    @PostMapping("/request-mentors")
    public ResponseEntity<Void> requestMentors(@RequestBody Map<String, Object> payload) {
        Long groupId = Long.valueOf(payload.get("groupId").toString());
        List<Integer> mentorIdsInt = (List<Integer>) payload.get("mentorIds");
        List<Long> mentorIds = mentorIdsInt.stream().map(Integer::longValue).collect(java.util.stream.Collectors.toList());

        groupService.sendMentorRequests(groupId, mentorIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<List<ConnectionRequest>> getPendingRequests(@RequestParam String email) {
        return ResponseEntity.ok(groupService.getPendingRequestsForUser(email));
    }

    @PutMapping("/requests/{id}/accept")
    public ResponseEntity<Void> acceptRequest(@PathVariable Long id) {
        groupService.acceptRequest(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/requests/{id}/reject")
    public ResponseEntity<Void> rejectRequest(@PathVariable Long id) {
        groupService.rejectRequest(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/messages/{groupId}")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.getGroupMessages(groupId));
    }

    @PostMapping("/messages/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody Map<String, Object> payload) {
        Long groupId = Long.valueOf(payload.get("groupId").toString());
        String email = (String) payload.get("senderEmail");
        String content = (String) payload.get("content");
        return ResponseEntity.ok(groupService.saveMessage(groupId, email, content));
    }

    @GetMapping("/potential-mentors/{groupId}")
    public ResponseEntity<List<Map<String, Object>>> getPotentialMentors(
            @PathVariable Long groupId,
            @RequestParam(value = "search", required = false, defaultValue = "") String search) {

        // 1. Fetch data from your existing repository join query
        List<Profile> matchedProfiles = profileRepository.searchPotentialMentors(groupId, search);

        // 2. Map fields inline directly to Java Maps instead of a custom class object
        List<Map<String, Object>> response = matchedProfiles.stream()
                .filter(p -> p.getUser() != null)
                .map(p -> {
                    Map<String, Object> mentorMap = new HashMap<>();
                    mentorMap.put("id", p.getUser().getId());
                    mentorMap.put("name", p.getUser().getName());
                    mentorMap.put("email", p.getUser().getEmail());
                    mentorMap.put("skills", p.getSkills());
                    return mentorMap;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
