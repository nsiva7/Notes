import React from 'react';
import { Search, Plus, FileText } from 'lucide-react';
import { Note, Category } from '../types/Note';
import { NoteCard } from './NoteCard';

interface SidebarProps {
  notes: Note[];
  categories: Category[];
  selectedNote: Note | null;
  searchQuery: string;
  onNoteSelect: (note: Note) => void;
  onCreateNote: () => void;
  onSearchChange: (query: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  categories,
  selectedNote,
  searchQuery,
  onNoteSelect,
  onCreateNote,
  onSearchChange,
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Notes</h1>
          </div>
          <button
            onClick={onCreateNote}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Create new note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No notes match your search' : 'No notes yet'}
          </div>
        ) : (
          <div className="p-2">
            {notes.map((note) => {
              const category = categories.find(cat => cat.id === note.category);
              return (
                <NoteCard
                  key={note.id}
                  note={note}
                  category={category}
                  isSelected={selectedNote?.id === note.id}
                  onClick={() => onNoteSelect(note)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};