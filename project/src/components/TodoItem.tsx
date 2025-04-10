import React, { useState } from 'react';
import { Check, Trash2, Edit2, X } from 'lucide-react';
import { Todo } from '../types/todo';
import { validateTitle, validateDescription, formatDate } from '../utils/validation';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const handleSave = () => {
    const titleValidation = validateTitle(editTitle);
    const descriptionValidation = validateDescription(editDescription);
    
    setTitleError(titleValidation);
    setDescriptionError(descriptionValidation);
    
    if (titleValidation || descriptionValidation) return;
    
    onUpdate(todo.id, editTitle, editDescription);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onToggle(todo.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {todo.completed && <Check size={14} className="text-white" />}
          </button>
          
          {isEditing ? (
            <div className="flex-1 space-y-2">
              <input
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  setTitleError(validateTitle(e.target.value));
                }}
                className={`w-full px-2 py-1 border rounded ${
                  titleError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {titleError && (
                <p className="text-red-500 text-sm">{titleError}</p>
              )}
              <textarea
                value={editDescription}
                onChange={(e) => {
                  setEditDescription(e.target.value);
                  setDescriptionError(validateDescription(e.target.value));
                }}
                className={`w-full px-2 py-1 border rounded ${
                  descriptionError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {descriptionError && (
                <p className="text-red-500 text-sm">{descriptionError}</p>
              )}
            </div>
          ) : (
            <div>
              <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {todo.title}
              </h3>
              <p className={`text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-green-500 hover:text-green-600 transition-colors"
              >
                <Check size={20} />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(todo.title);
                  setEditDescription(todo.description);
                  setTitleError(null);
                  setDescriptionError(null);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-2 flex space-x-4 text-xs text-gray-500">
        <span title={new Date(todo.createdAt).toLocaleString()}>
          Created {formatDate(todo.createdAt)}
        </span>
        <span title={new Date(todo.updatedAt).toLocaleString()}>
          Updated {formatDate(todo.updatedAt)}
        </span>
      </div>
    </div>
  );
}