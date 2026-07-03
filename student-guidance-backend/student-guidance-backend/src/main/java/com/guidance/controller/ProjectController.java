package com.guidance.controller;

import com.guidance.model.Project;
import com.guidance.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(
        origins = "http://localhost:8081",
        allowedHeaders = "*",
        exposedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowCredentials = "true"
)
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project savedProject = projectService.saveProject(project);
        return ResponseEntity.ok(savedProject);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // 🆕 Fetch user specific group records
    @GetMapping("/my-projects")
    public ResponseEntity<List<Project>> getMyProjects(@RequestParam String email) {
        System.out.println("email: " + email);
        return ResponseEntity.ok(projectService.getProjectsByUserGroups(email));
    }

    // Add this method inside your ProjectController class
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project updatedProject, @RequestParam String email) {
        try {
            boolean hasPermission = projectService.isUserMemberOfProjectGroup(id, email);
            if (!hasPermission) {
                return ResponseEntity.status(403).body("Access Denied: You are not a member of the group that owns this project.");
            }
            Project project = projectService.updateProject(id, updatedProject);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id, @RequestParam String email) {
        boolean hasPermission = projectService.isUserMemberOfProjectGroup(id, email);
        if (!hasPermission) {
            return ResponseEntity.status(403).body("Access Denied: You are not a member of the group that owns this project.");
        }
        boolean deleted = projectService.deleteProject(id);
        if (deleted) {
            return ResponseEntity.ok().body(Map.of("message", "Project successfully deleted."));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/mentorship-summary")
    public ResponseEntity<Map<String, Object>> getMentorshipSummary(@RequestParam String email) {
        return ResponseEntity.ok(projectService.getMentorshipSummary(email));
    }
}