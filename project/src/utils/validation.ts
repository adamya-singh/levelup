export const validateTitle = (title: string): string | null => {
  if (!title.trim()) return 'Title is required';
  if (title.length > 100) return 'Title must be 100 characters or less';
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (description.length > 500) return 'Description must be 500 characters or less';
  return null;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}; 