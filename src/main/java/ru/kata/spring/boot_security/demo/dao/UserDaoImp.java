package ru.kata.spring.boot_security.demo.dao;


import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;


import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;


@Repository
public class UserDaoImp implements UserDao {

    private EntityManager entityManager;

    @Override
    public void add(User user) {
        entityManager.persist(user);

    }

    @Override
    public void update(User user) {
        User u = entityManager.find(User.class, user.getId());
        entityManager.merge(user);
    }

    @Override
    public void delete(int id) {
        User user = entityManager.find(User.class, id);
        if (user != null) {
            entityManager.remove(user);
        } else {
            throw new EntityNotFoundException("пользователь с ID " + id + " не найден.");
        }
    }

    @Override
    public List<User> findAll() {
        TypedQuery<User> query = entityManager.createQuery("from User", User.class);
        return query.getResultList();
    }

    @Override
    public User findById(int id) {
        return entityManager.find(User.class, id);
    }
}
