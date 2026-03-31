package com.teammanagement.config;

import com.teammanagement.model.*;
import com.teammanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private TeamRepository teamRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.existsByUsername("admin")) return;

        // Create Manager
        User manager = new User();
        manager.setUsername("admin");
        manager.setEmail("admin@company.com");
        manager.setPassword(passwordEncoder.encode("admin123"));
        manager.setFullName("System Administrator");
        manager.setRole(User.Role.MANAGER);
        manager.setDepartment("Management");
        manager.setActive(true);
        manager = userRepository.save(manager);

        // Create IT Lead
        User lead1 = new User();
        lead1.setUsername("lead_it");
        lead1.setEmail("lead.it@company.com");
        lead1.setPassword(passwordEncoder.encode("lead123"));
        lead1.setFullName("Alice Johnson");
        lead1.setRole(User.Role.TEAM_LEAD);
        lead1.setDepartment("IT");
        lead1.setActive(true);
        lead1 = userRepository.save(lead1);

        // Create Sales Lead
        User lead2 = new User();
        lead2.setUsername("lead_sales");
        lead2.setEmail("lead.sales@company.com");
        lead2.setPassword(passwordEncoder.encode("lead123"));
        lead2.setFullName("Bob Smith");
        lead2.setRole(User.Role.TEAM_LEAD);
        lead2.setDepartment("Sales");
        lead2.setActive(true);
        lead2 = userRepository.save(lead2);

        // Create IT Team
        Team itTeam = new Team();
        itTeam.setName("IT Development");
        itTeam.setDescription("Software development team");
        itTeam.setTeamLead(lead1);
        itTeam.setActive(true);
        itTeam = teamRepository.save(itTeam);

        // Create Sales Team
        Team salesTeam = new Team();
        salesTeam.setName("Sales Team");
        salesTeam.setDescription("Sales and marketing team");
        salesTeam.setTeamLead(lead2);
        salesTeam.setActive(true);
        salesTeam = teamRepository.save(salesTeam);

        // Assign leads to teams
        lead1.setTeam(itTeam);
        userRepository.save(lead1);
        lead2.setTeam(salesTeam);
        userRepository.save(lead2);

        // Create Members
        User member1 = new User();
        member1.setUsername("john_dev");
        member1.setEmail("john@company.com");
        member1.setPassword(passwordEncoder.encode("member123"));
        member1.setFullName("John Developer");
        member1.setRole(User.Role.MEMBER);
        member1.setDepartment("IT");
        member1.setTeam(itTeam);
        member1.setActive(true);
        member1 = userRepository.save(member1);

        User member2 = new User();
        member2.setUsername("jane_dev");
        member2.setEmail("jane@company.com");
        member2.setPassword(passwordEncoder.encode("member123"));
        member2.setFullName("Jane Developer");
        member2.setRole(User.Role.MEMBER);
        member2.setDepartment("IT");
        member2.setTeam(itTeam);
        member2.setActive(true);
        member2 = userRepository.save(member2);

        User member3 = new User();
        member3.setUsername("sales_rep");
        member3.setEmail("sales@company.com");
        member3.setPassword(passwordEncoder.encode("member123"));
        member3.setFullName("Sam Sales");
        member3.setRole(User.Role.MEMBER);
        member3.setDepartment("Sales");
        member3.setTeam(salesTeam);
        member3.setActive(true);
        member3 = userRepository.save(member3);

        // Create Tasks
        Task t1 = new Task();
        t1.setTitle("Setup CI/CD Pipeline");
        t1.setDescription("Configure Jenkins for automated deployments");
        t1.setAssignedTo(member1);
        t1.setCreatedBy(lead1);
        t1.setTeam(itTeam);
        t1.setPriority(Task.Priority.HIGH);
        t1.setStatus(Task.Status.IN_PROGRESS);
        t1.setDueDate(LocalDate.now().plusDays(3));
        taskRepository.save(t1);

        Task t2 = new Task();
        t2.setTitle("Fix Login Bug");
        t2.setDescription("Users unable to login with special characters");
        t2.setAssignedTo(member2);
        t2.setCreatedBy(lead1);
        t2.setTeam(itTeam);
        t2.setPriority(Task.Priority.HIGH);
        t2.setStatus(Task.Status.REVIEW);
        t2.setDueDate(LocalDate.now().plusDays(1));
        taskRepository.save(t2);

        Task t3 = new Task();
        t3.setTitle("Update API Documentation");
        t3.setDescription("Document new REST endpoints");
        t3.setAssignedTo(member1);
        t3.setCreatedBy(lead1);
        t3.setTeam(itTeam);
        t3.setPriority(Task.Priority.MEDIUM);
        t3.setStatus(Task.Status.TODO);
        t3.setDueDate(LocalDate.now().plusDays(7));
        taskRepository.save(t3);

        Task t4 = new Task();
        t4.setTitle("Q1 Sales Report");
        t4.setDescription("Prepare quarterly sales analysis");
        t4.setAssignedTo(member3);
        t4.setCreatedBy(lead2);
        t4.setTeam(salesTeam);
        t4.setPriority(Task.Priority.HIGH);
        t4.setStatus(Task.Status.IN_PROGRESS);
        t4.setDueDate(LocalDate.now().plusDays(2));
        taskRepository.save(t4);

        Task t5 = new Task();
        t5.setTitle("Client Follow-up Calls");
        t5.setDescription("Follow up with 10 key clients");
        t5.setAssignedTo(member3);
        t5.setCreatedBy(lead2);
        t5.setTeam(salesTeam);
        t5.setPriority(Task.Priority.MEDIUM);
        t5.setStatus(Task.Status.DONE);
        t5.setDueDate(LocalDate.now().minusDays(1));
        taskRepository.save(t5);

        System.out.println("==============================================");
        System.out.println(" Sample data initialized successfully!");
        System.out.println(" Manager  : admin / admin123");
        System.out.println(" IT Lead  : lead_it / lead123");
        System.out.println(" Sales Lead: lead_sales / lead123");
        System.out.println(" Members  : john_dev, jane_dev, sales_rep / member123");
        System.out.println("==============================================");
    }
}
