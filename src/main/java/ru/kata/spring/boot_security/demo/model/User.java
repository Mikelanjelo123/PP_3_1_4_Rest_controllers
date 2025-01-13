package ru.kata.spring.boot_security.demo.model;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Pattern(regexp = "^[А-ЯA-Z][а-яa-z]+$", message = "неккоректный ввод Имени")
    @NotEmpty(message = "Имя не может быть пустым")
    @Column(name = "first_Name")
    private String firstName;

    @Pattern(regexp = "^[А-ЯA-Z][а-яa-z]+$", message = "неккоректный ввод Фамилии")
    @NotEmpty(message = "Фамилия не может быть пустым")
    @Column(name = "last_name")
    private String lastName;

    @NotEmpty(message = "Email не может быть пустым")
    @Email(message = "некорректный Email")
    @Column(name = "email")
    private String email;

    @Column(name = "userName")
    private String userName;

    @Column(name = "password")
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "User-role", joinColumns = @JoinColumn(name = "User_id"), inverseJoinColumns = @JoinColumn(name ="Role_id"))
    private Set<Role> roles;
    private boolean enabled;
    private boolean accountNonExpired;
    private boolean accountNonLocked;
    private boolean credentialsNonExpired;

    public User() {
    }

    public String getUserName() {
        return userName;
    }

    public Set<Role> getRoles() {
        return roles;
    }
public void setRoles(Set<Role> roles) {
        this.roles = roles;
}
    public int getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

    @Override
    public final boolean equals(Object o) {
        if (!(o instanceof User user)) return false;

        return id == user.id && firstName.equals(user.firstName) && lastName.equals(user.lastName) && email.equals(user.email);
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + firstName.hashCode();
        result = 31 * result + lastName.hashCode();
        result = 31 * result + email.hashCode();
        return result;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getRoles();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
