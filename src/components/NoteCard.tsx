import React from 'react';
import { Note, Category } from '../types/Note';

interface NoteCardProps {
  note: Note;
  category?: Category;
  isSelected: boolean;
  onClick: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  category,
  isSelected,
  onClick,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPreview = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'bg-blue-50 border-blue-200 shadow-sm'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className={`font-medium text-sm ${
          isSelected ? 'text-blue-900' : 'text-gray-900'
        } truncate flex-1`}>
          {note.title}
        </h3>
        {category && (
          <div
            className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
            style={{ backgroundColor: category.color }}
            title={category.name}
          />
        )}
      </div>
      
      {note.content && (
        <p className="text-xs text-gray-600 mb-2 leading-relaxed">
          {getPreview(note.content)}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(note.updatedAt)}</span>
        {note.tags.length > 0 && (
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {note.tags.length} tag{note.tags.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};