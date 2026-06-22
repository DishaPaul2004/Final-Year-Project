package com.guidance.controller;

import com.guidance.model.User;
import com.guidance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, String>> getUserNameAndEmail(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("name", user.getName());
                    response.put("email", user.getEmail());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}