//package com.guidance.service;
//
//import com.guidance.model.User;
//import com.guidance.repository.UserRepository;
//import com.guidance.security.jwtUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//import java.util.Optional;
//
//@Service
//public class AuthService {
//    private final UserRepository userRepository;
//    //private final BCryptPasswordEncoder encoder;
//    private final jwtUtils jwtUtils;
//
//   public AuthService(UserRepository userRepository, jwtUtils jwtUtils) {
//        this.userRepository = userRepository;
//        //this.encoder = new BCryptPasswordEncoder();
//        this.jwtUtils = jwtUtils;
//    }
//
//    public String register(String name, String email, String password) {
//      /*  if (UserRepository.findByEmail(email).isPresent()) {
//            return "Email already exists!";
//        }*/
//        User user = new User();
//        user.setName(name);
//        user.setEmail(email);
//        user.setPassword/*(encoder.encode*/(password)/*)*/;
//        userRepository.save(user);
//        return "user registered successfully!";
//    }
//
//    public String login(String email, String password) {
//        User user = userRepository.findByEmail(email);
//
//        if (user == null) {
//            return "User not found!";
//        }
//
//        if (!password.equals(user.getPassword())) {
//            return "Invalid credentials!";
//        }
//
//        // Return token or message
//        return jwtUtils.generateToken(email, user.getName());
//    }
//}
package com.guidance.service;

import com.guidance.model.User;
import com.guidance.repository.UserRepository;
import com.guidance.security.jwtUtils;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final jwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, jwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    public String register(String name, String email, String password) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        userRepository.save(user);
        return "user registered successfully!";
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return "User not found!";
        }

        if (!password.equals(user.getPassword())) {
            return "Invalid credentials!";
        }

        return jwtUtils.generateToken(email, user.getName());
    }

    // ✅ ADD THIS METHOD to fetch user data for the AuthController
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}