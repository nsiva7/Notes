import React, { useRef, useEffect, useState } from 'react';
import { Toolbar } from './Toolbar';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string, htmlValue: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your note..."
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.contentEditable = 'true';
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (editorRef.current && isInitialized) {
      const currentHtml = editorRef.current.innerHTML;
      if (value !== editorRef.current.textContent) {
        // Only update if the content is different to avoid cursor issues
        if (value === '') {
          editorRef.current.innerHTML = '';
        } else if (!currentHtml.includes(value)) {
          editorRef.current.textContent = value;
        }
      }
    }
  }, [value, isInitialized]);

  const handleInput = () => {
    if (editorRef.current) {
      const textContent = editorRef.current.textContent || '';
      const htmlContent = editorRef.current.innerHTML;
      onChange(textContent, htmlContent);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '10px 0';
        
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
          range.setStartAfter(img);
          range.setEndAfter(img);
          selection.removeAllRanges();
          selection.addRange(range);
        } else if (editorRef.current) {
          editorRef.current.appendChild(img);
        }
        
        handleInput();
      };
      reader.readAsDataURL(file);
    }
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportFile = () => {
    importInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (editorRef.current) {
          // Handle different file types
          if (file.name.endsWith('.html')) {
            editorRef.current.innerHTML = content;
          } else if (file.name.endsWith('.md')) {
            // Basic Markdown to HTML conversion
            const htmlContent = content
              .replace(/^### (.*$)/gm, '<h3>$1</h3>')
              .replace(/^## (.*$)/gm, '<h2>$1</h2>')
              .replace(/^# (.*$)/gm, '<h1>$1</h1>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/_(.*?)_/g, '<u>$1</u>')
              .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
              .replace(/^\- (.*$)/gm, '<li>$1</li>')
              .replace(/^(\d+)\. (.*$)/gm, '<li>$1</li>')
              .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1">')
              .replace(/\n/g, '<br>');
            editorRef.current.innerHTML = htmlContent;
          } else {
            // Plain text
            editorRef.current.textContent = content;
          }
          handleInput();
        }
      };
      reader.readAsText(file);
    }
    
    // Reset the input
    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  };

  const handleExportAs = async (format: 'txt' | 'html' | 'pdf' | 'md' | 'image') => {
    if (!editorRef.current) return;

    const title = document.querySelector('input[placeholder="Note title..."]') as HTMLInputElement;
    const noteTitle = title?.value || 'Untitled Note';

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'txt':
        content = editorRef.current.textContent || '';
        filename = `${noteTitle}.txt`;
        mimeType = 'text/plain';
        break;
      
      case 'html':
        content = `<!DOCTYPE html>
<html>
<head>
  <title>${noteTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <h1>${noteTitle}</h1>
  ${editorRef.current.innerHTML}
</body>
</html>`;
        filename = `${noteTitle}.html`;
        mimeType = 'text/html';
        break;
      
      case 'md':
        // Basic HTML to Markdown conversion
        const htmlContent = editorRef.current.innerHTML;
        content = htmlContent
          .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
          .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
          .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
          .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
          .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
          .replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_')
          .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
          .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
            return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
          })
          .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
            let counter = 1;
            return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
          })
          .replace(/<br[^>]*>/gi, '\n')
          .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
          .replace(/<img[^>]*src="([^"]*)*"[^>]*>/gi, '![Image]($1)')
          .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
          .replace(/\n{3,}/g, '\n\n') // Clean up multiple newlines
          .trim();
        filename = `${noteTitle}.md`;
        mimeType = 'text/markdown';
        break;
      
      case 'image':
        // Use browser's built-in print functionality
        const printWindow = window.open('', '_blank');
        if (printWindow && editorRef.current) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${noteTitle}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; background: white; }
                img { max-width: 100%; height: auto; }
              </style>
            </head>
            <body>
              <h1>${noteTitle}</h1>
              ${editorRef.current.innerHTML}
            </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        }
        return;
      
      case 'pdf':
        // Use browser's built-in print to PDF functionality
        const pdfWindow = window.open('', '_blank');
        if (pdfWindow && editorRef.current) {
          pdfWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${noteTitle}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; background: white; }
                img { max-width: 100%; height: auto; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <h1>${noteTitle}</h1>
              ${editorRef.current.innerHTML}
            </body>
            </html>
          `);
          pdfWindow.document.close();
          pdfWindow.focus();
          pdfWindow.print();
        }
        return;
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = document.createElement('img');
              img.src = e.target?.result as string;
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.display = 'block';
              img.style.margin = '10px 0';
              img.style.borderRadius = '8px';
              img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(img);
                range.setStartAfter(img);
                range.setEndAfter(img);
                selection.removeAllRanges();
                selection.addRange(range);
              } else if (editorRef.current) {
                editorRef.current.appendChild(img);
              }
              
              handleInput();
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Toolbar
        onFormat={handleFormat}
        onInsertImage={handleInsertImage}
        onImportFile={handleImportFile}
        onExportAs={handleExportAs}
      />
      
      <div className="flex-1 p-4">
        <div
          ref={editorRef}
          onInput={handleInput}
          onPaste={handlePaste}
          className="w-full h-full outline-none text-gray-900 leading-relaxed min-h-96"
          style={{ 
            minHeight: 'calc(100vh - 300px)',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}
          suppressContentEditableWarning={true}
          data-placeholder={placeholder}
        />
        
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        
        <input
          ref={importInputRef}
          type="file"
          accept=".txt,.html,.md,.json"
          onChange={handleFileImport}
          className="hidden"
        />
      </div>
      
      <style jsx>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};