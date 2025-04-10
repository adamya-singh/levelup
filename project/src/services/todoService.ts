import { CreateTodoDto, Todo, UpdateTodoDto } from '../types/todo';
import { PerformanceMonitor } from '../utils/performance';

const API_BASE_URL = 'http://localhost:8080/api/todos';
const performanceMonitor = PerformanceMonitor.getInstance();

export const todoService = {
  async getAllTodos(): Promise<Todo[]> {
    const startTime = performance.now();
    
    // Check cache first
    const cachedTodos = performanceMonitor.getCache('todos');
    if (cachedTodos) {
      performanceMonitor.recordMetric('cache_hit', performance.now() - startTime);
      return cachedTodos;
    }

    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch todos');
    
    const todos = await response.json();
    performanceMonitor.setCache('todos', todos);
    
    performanceMonitor.recordMetric('api_latency', performance.now() - startTime);
    return todos;
  },

  async createTodo(todo: CreateTodoDto): Promise<Todo> {
    const startTime = performance.now();
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    
    const newTodo = await response.json();
    performanceMonitor.clearCache(); // Invalidate cache on write
    
    performanceMonitor.recordMetric('create_latency', performance.now() - startTime);
    return newTodo;
  },

  async updateTodo(id: string, todo: UpdateTodoDto): Promise<Todo> {
    const startTime = performance.now();
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('Failed to update todo');
    
    const updatedTodo = await response.json();
    performanceMonitor.clearCache(); // Invalidate cache on write
    
    performanceMonitor.recordMetric('update_latency', performance.now() - startTime);
    return updatedTodo;
  },

  async deleteTodo(id: string): Promise<void> {
    const startTime = performance.now();
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
    
    performanceMonitor.clearCache(); // Invalidate cache on write
    performanceMonitor.recordMetric('delete_latency', performance.now() - startTime);
  },

  getPerformanceMetrics() {
    return {
      apiLatency: performanceMonitor.getAverageMetric('api_latency'),
      createLatency: performanceMonitor.getAverageMetric('create_latency'),
      updateLatency: performanceMonitor.getAverageMetric('update_latency'),
      deleteLatency: performanceMonitor.getAverageMetric('delete_latency'),
      cacheHitRate: performanceMonitor.getAverageMetric('cache_hit') > 0 ? 1 : 0
    };
  }
};