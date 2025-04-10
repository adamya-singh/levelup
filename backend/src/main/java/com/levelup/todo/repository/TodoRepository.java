package com.levelup.todo.repository;

import com.levelup.todo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TodoRepository extends JpaRepository<Todo, String> {
    // Custom query methods can be added here if needed
    // For example:
    // List<Todo> findByCompleted(boolean completed);
    // List<Todo> findByTitleContaining(String title);
} 