import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const titleValidation = validateTitle(title);
    const descriptionValidation = validateDescription(description);
    
    setTitleError(titleValidation);
    setDescriptionError(descriptionValidation);
    
    if (titleValidation || descriptionValidation) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ title, description });
      setTitle('');
      setDescription('');
      setTitleError(null);
      setDescriptionError(null);
    } finally {
      setIsSubmitting(false);
    }
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
            className={`w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              titleError ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          <span className={`text-sm ml-2 ${
            title.length > 90 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {title.length}/100
          </span>
        </div>
        {titleError && (
          <div className="flex items-center space-x-1 text-red-500 text-sm">
            <AlertCircle size={14} />
            <p>{titleError}</p>
          </div>
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
            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20 transition-colors ${
              descriptionError ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          <span className={`text-sm ml-2 ${
            description.length > 450 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {description.length}/500
          </span>
        </div>
        {descriptionError && (
          <div className="flex items-center space-x-1 text-red-500 text-sm">
            <AlertCircle size={14} />
            <p>{descriptionError}</p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
          isSubmitting
            ? 'bg-blue-400 cursor-not-allowed'
            : 'hover:bg-blue-600'
        }`}
      >
        <Plus size={20} />
        <span>{isSubmitting ? 'Adding Task...' : 'Add Task'}</span>
      </button>
    </form>
  );
}