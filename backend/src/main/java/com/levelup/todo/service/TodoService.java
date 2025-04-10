package com.levelup.todo.service;

import com.levelup.todo.dto.CreateTodoDto;
import com.levelup.todo.dto.UpdateTodoDto;
import com.levelup.todo.model.Todo;

import java.util.List;

public interface TodoService {
    List<Todo> getAllTodos();
    Todo getTodoById(String id);
    Todo createTodo(CreateTodoDto todoDto);
    Todo updateTodo(String id, UpdateTodoDto todoDto);
    void deleteTodo(String id);
} 