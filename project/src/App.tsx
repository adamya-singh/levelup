import React, { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { Todo } from './types/todo';
import { todoService } from './services/todoService';
import { TodoItem } from './components/TodoItem';
import { TodoForm } from './components/TodoForm';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todo: { title: string; description: string }) => {
    try {
      const newTodo = await todoService.createTodo(todo);
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setError('Failed to create todo. Please try again.');
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await todoService.updateTodo(id, {
        completed: !todo.completed
      });
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center space-x-4 mb-8">
          <ClipboardList size={40} className="text-blue-500" />
          <h1 className="text-4xl font-bold text-gray-900">Todo App</h1>
        </div>

        <TodoForm onSubmit={handleCreateTodo} />

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="text-center text-gray-500">No todos yet. Add one above!</div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;