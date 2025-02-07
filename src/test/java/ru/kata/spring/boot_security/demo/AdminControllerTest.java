package ru.kata.spring.boot_security.demo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import ru.kata.spring.boot_security.demo.controllers.AdminController;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AdminControllerTest {

	private MockMvc mockMvc;

	@Mock
	private UserService userService;

	@Mock
	private RoleService roleService;

	@InjectMocks
	private AdminController adminController;

	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
	}

	@Test
	public void testListUsers() throws Exception {
		mockMvc.perform(get("/api/admin"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.users").exists())  // Проверка на наличие поля "users"
				.andExpect(jsonPath("$.roles").exists())  // Проверка на наличие поля "roles"
				.andExpect(jsonPath("$.personDetails").exists());  // Проверка на наличие поля "personDetails"
	}

	@Test
	public void testAddUser() throws Exception {
		Role userRole = new Role("ROLE_USER");
		Set<Role> rolesUser = new HashSet<>();
		rolesUser.add(userRole);
		User user = new User("User", "User", "user@exemple.ru", "user", rolesUser);

		// Мокируем поведение userService
		when(userService.findByEmail(user.getEmail())).thenReturn(Optional.empty());

		mockMvc.perform(post("/api/admin/add")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"newuser@example.com\",\"password\":\"password\",\"firstName\":\"New\",\"lastName\":\"User\"}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.email").value("newuser@example.com"));
	}

	@Test
	public void testEditUser() throws Exception {
		Set<Role> roleAdmin = new HashSet<>();
		Role adminRole = new Role("ROLE_ADMIN");
		roleAdmin.add(adminRole);
		User user = new User("User", "User", "user@exemple.ru", "user", roleAdmin);
		int userId = 1;

		// Мокируем поведение userService
		when(userService.findByEmail(user.getEmail())).thenReturn(Optional.empty());

		mockMvc.perform(put("/api/admin/edit/{id}", userId)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"updated@example.com\",\"password\":\"newpassword\",\"firstName\":\"Updated\",\"lastName\":\"User\"}")).andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value("updated@example.com"));
	}

	@Test
	public void testDeleteUser() throws Exception {
		int userId = 1;

		// Мокируем поведение userService
		doNothing().when(userService).delete(userId);

		mockMvc.perform(delete("/api/admin/delete{id}", userId))
				.andExpect(status().isOk())
				.andExpect(content().string("Пользователь удалён."));
	}
}
