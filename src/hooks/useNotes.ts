import { useState, useEffect, useCallback } from 'react';
import { Note, Category } from '../types/Note';

const NOTES_KEY = 'notes-app-data';
const CATEGORIES_KEY = 'notes-app-categories';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Personal', color: '#3B82F6' },
  { id: '2', name: 'Work', color: '#8B5CF6' },
  { id: '3', name: 'Ideas', color: '#F59E0B' },
  { id: '4', name: 'Todo', color: '#EF4444' },
];

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(NOTES_KEY);
    const savedCategories = localStorage.getItem(CATEGORIES_KEY);
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      setNotes(parsedNotes);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save to localStorage when notes change
  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  // Save categories to localStorage
  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  const createNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      category: categories[0].id,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      color: categories[0].color,
    };
    
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    return newNote;
  }, [categories]);

  const updateNote = useCallback((noteId: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        const updatedNote = { 
          ...note, 
          ...updates, 
          updatedAt: new Date() 
        };
        
        // Update color based on category
        if (updates.category) {
          const category = categories.find(cat => cat.id === updates.category);
          if (category) {
            updatedNote.color = category.color;
          }
        }
        
        if (selectedNote?.id === noteId) {
          setSelectedNote(updatedNote);
        }
        
        return updatedNote;
      }
      return note;
    }));
  }, [selectedNote, categories]);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  }, [selectedNote]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return {
    notes: filteredNotes,
    categories,
    selectedNote,
    searchQuery,
    setSelectedNote,
    setSearchQuery,
    createNote,
    updateNote,
    deleteNote,
    setCategories,
  };
};