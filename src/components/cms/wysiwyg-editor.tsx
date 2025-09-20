'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WysiwygEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const toolbarButtons = [
  { command: 'bold', icon: 'bold', title: 'Bold' },
  { command: 'italic', icon: 'italic', title: 'Italic' },
  { command: 'underline', icon: 'underline', title: 'Underline' },
  { command: 'separator' },
  { command: 'formatBlock', value: 'h1', icon: 'heading1', title: 'Heading 1' },
  { command: 'formatBlock', value: 'h2', icon: 'heading2', title: 'Heading 2' },
  { command: 'formatBlock', value: 'h3', icon: 'heading3', title: 'Heading 3' },
  { command: 'separator' },
  { command: 'insertUnorderedList', icon: 'list', title: 'Bullet List' },
  { command: 'insertOrderedList', icon: 'listOrdered', title: 'Numbered List' },
  { command: 'separator' },
  { command: 'createLink', icon: 'link', title: 'Insert Link' },
  { command: 'insertImage', icon: 'image', title: 'Insert Image' },
  { command: 'separator' },
  { command: 'justifyLeft', icon: 'alignLeft', title: 'Align Left' },
  { command: 'justifyCenter', icon: 'alignCenter', title: 'Align Center' },
  { command: 'justifyRight', icon: 'alignRight', title: 'Align Right' },
  { command: 'separator' },
  { command: 'undo', icon: 'undo', title: 'Undo' },
  { command: 'redo', icon: 'redo', title: 'Redo' }
];

export function WysiwygEditor({ content, onChange, placeholder, className }: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isEditorReady) {
      editorRef.current.innerHTML = content || '';
      setIsEditorReady(true);
    }
  }, [content, isEditorReady]);

  const executeCommand = (command: string, value?: string) => {
    if (command === 'createLink') {
      const url = prompt('Enter the URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else if (command === 'insertImage') {
      const url = prompt('Enter the image URL:');
      if (url) {
        document.execCommand(command, false, url);
      }
    } else if (command === 'formatBlock') {
      document.execCommand(command, false, `<${value}>`);
    } else {
      document.execCommand(command, false, value);
    }
    
    // Update content after command execution
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const renderToolbarButton = (button: any, index: number) => {
    if (button.command === 'separator') {
      return <div key={index} className="w-px h-6 bg-border" />;
    }

    const IconComponent = Icons[button.icon as keyof typeof Icons];
    
    return (
      <Button
        key={index}
        variant="ghost"
        size="sm"
        onClick={() => executeCommand(button.command, button.value)}
        title={button.title}
        className="h-8 w-8 p-0"
      >
        <IconComponent className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/40 flex-wrap">
        {toolbarButtons.map((button, index) => renderToolbarButton(button, index))}
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none"
        data-placeholder={placeholder}
        style={{
          display: content ? 'block' : 'block'
        }}
      />
      
      {/* Placeholder styling */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
        
        [contenteditable] {
          outline: none;
        }
        
        [contenteditable] h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 2rem;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}