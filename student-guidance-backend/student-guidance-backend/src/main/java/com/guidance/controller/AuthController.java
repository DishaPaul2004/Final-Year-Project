//package com.guidance.controller;
//
//import com.guidance.model.User;
//import com.guidance.repository.UserRepository;
//import com.guidance.service.AuthService;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//@RestController
//@CrossOrigin(origins = "http://localhost:8081")
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    private final AuthService authService;
//
//    public AuthController(AuthService authService) {
//        this.authService = authService;
//    }
//
//   /* @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
//        String name = body.get("name");
//        String email = body.get("email");
//        String password = body.get("password");
//        return ResponseEntity.ok(authService.register(name, email, password));
//    }*/
//
//    @PostMapping("/register")
//    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
//        authService.register(user.getName(),user.getEmail(),user.getPassword());
//        Map<String, String> response = new HashMap<>();
//        response.put("message", "User registered successfully");
//        return ResponseEntity.ok(response);
//    }
//
//
//    @PostMapping(value = "/login",consumes = {MediaType.APPLICATION_JSON_VALUE})
//    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, String> body) {
//        String email = body.get("email");
//        String password = body.get("password");
//
//        Map<String, String> response = new HashMap<>();
//        String result = authService.login(email, password);
//
//        // Always return a JSON response (never an empty one)
//        switch (result) {
//            case "User not found!":
//                response.put("message", "User not found!");
//                return ResponseEntity.status(401).body(response);
//
//            case "Invalid credentials!":
//                response.put("message", "Invalid credentials!");
//                return ResponseEntity.status(401).body(response);
//
//            default:
//                response.put("token", result);
//                response.put("message", "Login successful!");
//                return ResponseEntity.ok(response);
//        }
//    }
//
//
//
//
//}
package com.guidance.controller;

import com.guidance.model.User;
import com.guidance.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:8081")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        authService.register(user.getName(), user.getEmail(), user.getPassword());
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/login", consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Map<String, String> response = new HashMap<>();
        String result = authService.login(email, password);

        switch (result) {
            case "User not found!":
                response.put("message", "User not found!");
                return ResponseEntity.status(401).body(response);

            case "Invalid credentials!":
                response.put("message", "Invalid credentials!");
                return ResponseEntity.status(401).body(response);

            default:
                // ✅ Fetch user details from the database using our new service method
                User user = authService.findByEmail(email);

                // ✅ Add the vital profile attributes to the payload map
                response.put("token", result);
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                response.put("message", "Login successful!");
                return ResponseEntity.ok(response);
        }
    }
}