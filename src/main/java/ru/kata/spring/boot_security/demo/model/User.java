package ru.kata.spring.boot_security.demo.model;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;


@Entity
@Table(name = "users")
public class User {

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

    public User() {
    }

    public User(String firstName, String lastName, String email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
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
}
