import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { NoteEditor } from './components/NoteEditor';
import { useNotes } from './hooks/useNotes';

function App() {
  const {
    notes,
    categories,
    selectedNote,
    searchQuery,
    setSelectedNote,
    setSearchQuery,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'n') {
          e.preventDefault();
          createNote();
        }
        if (e.key === 'f') {
          e.preventDefault();
          const searchInput = document.querySelector('input[placeholder="Search notes..."]') as HTMLInputElement;
          searchInput?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [createNote]);

  return (
    <div className="h-screen bg-gray-100 flex">
      <Sidebar
        notes={notes}
        categories={categories}
        selectedNote={selectedNote}
        searchQuery={searchQuery}
        onNoteSelect={setSelectedNote}
        onCreateNote={createNote}
        onSearchChange={setSearchQuery}
      />
      <NoteEditor
        note={selectedNote}
        categories={categories}
        onUpdateNote={updateNote}
        onDeleteNote={deleteNote}
      />
    </div>
  );
}

export default App;