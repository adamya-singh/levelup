import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateTodoDto } from '../types/todo';
import { validateTitle, validateDescription } from '../utils/validation';

interface TodoFormProps {
  onSubmit: (todo: CreateTodoDto) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const titleValidation = validateTitle(title);
    const descriptionValidation = validateDescription(description);
    
    setTitleError(titleValidation);
    setDescriptionError(descriptionValidation);
    
    if (titleValidation || descriptionValidation) return;
    
    onSubmit({ title, description });
    setTitle('');
    setDescription('');
    setTitleError(null);
    setDescriptionError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(validateTitle(e.target.value));
            }}
            placeholder="What needs to be done?"
            className={`w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              titleError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <span className="text-sm text-gray-500 ml-2">{title.length}/100</span>
        </div>
        {titleError && (
          <p className="text-red-500 text-sm">{titleError}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDescriptionError(validateDescription(e.target.value));
            }}
            placeholder="Add a description (optional)"
            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20 ${
              descriptionError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <span className="text-sm text-gray-500 ml-2">{description.length}/500</span>
        </div>
        {descriptionError && (
          <p className="text-red-500 text-sm">{descriptionError}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
      >
        <Plus size={20} />
        <span>Add Todo</span>
      </button>
    </form>
  );
}