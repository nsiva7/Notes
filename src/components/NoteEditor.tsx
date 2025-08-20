import React, { useState, useEffect } from 'react';
import { Save, Trash2, Download, Tag, Calendar, FileText } from 'lucide-react';
import { Note, Category } from '../types/Note';
import { RichTextEditor } from './RichTextEditor';

interface NoteEditorProps {
  note: Note | null;
  categories: Category[];
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  categories,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setHtmlContent(note.htmlContent || '');
      setCategory(note.category);
      setTags(note.tags);
      setHasChanges(false);
    }
  }, [note]);

  useEffect(() => {
    if (note && (
      title !== note.title ||
      content !== note.content ||
      htmlContent !== (note.htmlContent || '') ||
      category !== note.category ||
      JSON.stringify(tags) !== JSON.stringify(note.tags)
    )) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [note, title, content, htmlContent, category, tags]);

  const handleSave = () => {
    if (note && hasChanges) {
      onUpdateNote(note.id, { title, content, htmlContent, category, tags });
      setHasChanges(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDownload = () => {
    if (!note) return;
    
    // Create HTML export with rich content
    const htmlExport = `<!DOCTYPE html>
<html>
<head>
  <title>${note.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  ${htmlContent || note.content}
</body>
</html>`;
    
    const blob = new Blob([htmlExport], {
      type: 'text/html',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasChanges) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [hasChanges, title, content, htmlContent, category, tags]);

  const handleContentChange = (textContent: string, htmlValue: string) => {
    setContent(textContent);
    setHtmlContent(htmlValue);
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">No note selected</p>
          <p className="text-sm">Create a new note or select an existing one to get started</p>
        </div>
      </div>
    );
  }

  const currentCategory = categories.find(cat => cat.id === category);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 mr-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-gray-900 border-none outline-none bg-transparent placeholder-gray-400"
              placeholder="Note title..."
            />
          </div>
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <span className="text-sm text-amber-600 mr-2">Saving...</span>
            )}
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download note"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteNote(note.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDate(note.createdAt)}</span>
          </div>
          {note.updatedAt > note.createdAt && (
            <span>• Modified {formatDate(note.updatedAt)}</span>
          )}
        </div>

        {/* Category and tags */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {currentCategory && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentCategory.color }}
              />
            )}
          </div>

          <div className="flex items-center space-x-2 flex-1">
            <Tag className="w-4 h-4 text-gray-500" />
            <div className="flex flex-wrap items-center gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
                  onClick={() => handleRemoveTag(tag)}
                  title="Click to remove"
                >
                  {tag} ×
                </span>
              ))}
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="px-2 py-1 text-xs border-none outline-none bg-transparent placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <RichTextEditor
        value={content}
        onChange={handleContentChange}
        placeholder="Start writing your note..."
      />
    </div>
  );
};