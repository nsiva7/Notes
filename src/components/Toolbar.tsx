import React, { useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code, Minus, Image, Upload, Download, FileImage, 
  FileText, FileSpreadsheet, Type, Palette
} from 'lucide-react';

interface ToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onInsertImage: () => void;
  onImportFile: () => void;
  onExportAs: (format: 'txt' | 'html' | 'pdf' | 'md' | 'image') => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  onFormat, 
  onInsertImage, 
  onImportFile, 
  onExportAs 
}) => {
  const [fontSize, setFontSize] = useState('16');
  const [fontColor, setFontColor] = useState('#000000');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    onFormat('fontSize', size + 'px');
  };

  const handleColorChange = (color: string) => {
    setFontColor(color);
    onFormat('foreColor', color);
  };

  return (
    <div className="border-b border-gray-200 p-2 bg-white">
      <div className="flex items-center space-x-1 flex-wrap">
        {/* Font Size */}
        <select
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20">20px</option>
          <option value="24">24px</option>
          <option value="32">32px</option>
        </select>

        {/* Font Color */}
        <div className="relative">
          <input
            type="color"
            value={fontColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <button
          onClick={() => onFormat('bold')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onFormat('italic')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onFormat('underline')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onFormat('strikeThrough')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <button
          onClick={() => onFormat('justifyLeft')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onFormat('justifyCenter')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onFormat('justifyRight')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          onClick={() => onFormat('insertUnorderedList')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onFormat('insertOrderedList')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Special Elements */}
        <button
          onClick={() => onFormat('formatBlock', 'blockquote')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onFormat('formatBlock', 'pre')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onFormat('insertHorizontalRule')}
          className="p-2 hover:bg-gray-100 rounded"
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Media */}
        <button
          onClick={onInsertImage}
          className="p-2 hover:bg-gray-100 rounded"
          title="Insert Image"
        >
          <Image className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Import */}
        <button
          onClick={onImportFile}
          className="p-2 hover:bg-gray-100 rounded"
          title="Import File"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Export */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="p-2 hover:bg-gray-100 rounded flex items-center"
            title="Export As..."
          >
            <Download className="w-4 h-4 mr-1" />
            <span className="text-sm">Export</span>
          </button>
          
          {showExportMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
              <button
                onClick={() => { onExportAs('txt'); setShowExportMenu(false); }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Text
              </button>
              <button
                onClick={() => { onExportAs('html'); setShowExportMenu(false); }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <Type className="w-4 h-4 mr-2" />
                HTML
              </button>
              <button
                onClick={() => { onExportAs('md'); setShowExportMenu(false); }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Markdown
              </button>
              <button
                onClick={() => { onExportAs('pdf'); setShowExportMenu(false); }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => { onExportAs('image'); setShowExportMenu(false); }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <FileImage className="w-4 h-4 mr-2" />
                Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};