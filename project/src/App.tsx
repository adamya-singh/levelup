import React, { useEffect, useState } from 'react';
import { ClipboardList, BarChart2 } from 'lucide-react';
import { Todo } from './types/todo';
import { todoService } from './services/todoService';
import { TodoItem } from './components/TodoItem';
import { TodoForm } from './components/TodoForm';
import { PerformanceMetrics } from './components/PerformanceMetrics';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

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
      // Optimistic update
      const optimisticTodo: Todo = {
        id: 'temp-' + Date.now(),
        title: todo.title,
        description: todo.description,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTodos(prev => [...prev, optimisticTodo]);

      const newTodo = await todoService.createTodo(todo);
      setTodos(prev => prev.map(t => t.id === optimisticTodo.id ? newTodo : t));
    } catch (err) {
      setError('Failed to create todo. Please try again.');
      // Rollback optimistic update
      setTodos(prev => prev.filter(t => !t.id.startsWith('temp-')));
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      // Optimistic update
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));

      const updatedTodo = await todoService.updateTodo(id, {
        completed: !todo.completed
      });
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      // Rollback optimistic update
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, completed: todo.completed } : t
      ));
    }
  };

  const handleUpdateTodo = async (id: string, title: string, description: string) => {
    try {
      // Optimistic update
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, title, description } : t
      ));

      const updatedTodo = await todoService.updateTodo(id, {
        title,
        description
      });
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      // Rollback optimistic update
      const originalTodo = todos.find(t => t.id === id);
      if (originalTodo) {
        setTodos(prev => prev.map(t => 
          t.id === id ? originalTodo : t
        ));
      }
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      // Optimistic update
      setTodos(prev => prev.filter(t => t.id !== id));
      await todoService.deleteTodo(id);
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      // Reload todos to ensure consistency
      loadTodos();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <ClipboardList size={40} className="text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900">LevelUp Task Manager</h1>
          </div>
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <BarChart2 size={20} />
            <span>{showMetrics ? 'Hide Metrics' : 'Show Metrics'}</span>
          </button>
        </div>

        {showMetrics && (
          <div className="mb-8">
            <PerformanceMetrics />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TodoForm onSubmit={handleCreateTodo} />

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            <div className="mt-8 space-y-4">
              {loading ? (
                <div className="text-center text-gray-500">Loading tasks...</div>
              ) : todos.length === 0 ? (
                <div className="text-center text-gray-500">No tasks yet. Add one above!</div>
              ) : (
                todos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Statistics</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-2xl font-bold">{todos.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed Tasks</p>
                  <p className="text-2xl font-bold text-green-500">
                    {todos.filter(t => t.completed).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {todos.length > 0
                      ? `${Math.round((todos.filter(t => t.completed).length / todos.length) * 100)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;