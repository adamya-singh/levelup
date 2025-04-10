package com.levelup.todo.service;

import com.levelup.todo.dto.CreateTodoDto;
import com.levelup.todo.dto.UpdateTodoDto;
import com.levelup.todo.model.Todo;
import com.levelup.todo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    @Autowired
    public TodoServiceImpl(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    @Override
    public Todo getTodoById(String id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
    }

    @Override
    public Todo createTodo(CreateTodoDto todoDto) {
        Todo todo = new Todo();
        todo.setId(UUID.randomUUID().toString());
        todo.setTitle(todoDto.getTitle());
        todo.setDescription(todoDto.getDescription());
        return todoRepository.save(todo);
    }

    @Override
    public Todo updateTodo(String id, UpdateTodoDto todoDto) {
        Todo todo = getTodoById(id);
        
        if (todoDto.getTitle() != null) {
            todo.setTitle(todoDto.getTitle());
        }
        
        if (todoDto.getDescription() != null) {
            todo.setDescription(todoDto.getDescription());
        }
        
        if (todoDto.getCompleted() != null) {
            todo.setCompleted(todoDto.getCompleted());
        }
        
        return todoRepository.save(todo);
    }

    @Override
    public void deleteTodo(String id) {
        if (!todoRepository.existsById(id)) {
            throw new RuntimeException("Todo not found with id: " + id);
        }
        todoRepository.deleteById(id);
    }
} 