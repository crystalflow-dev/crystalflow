/**
 * Resizable Panel Component
 * Allows users to resize panels with drag handles and constraints
 */

import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

export interface ResizablePanelProps {
  /** Panel content */
  children: ReactNode;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Default width in pixels */
  defaultWidth?: number;
  /** LocalStorage key for persisting width */
  storageKey?: string;
  /** Position of resize handle */
  resizeHandle?: 'left' | 'right';
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Callback when width changes */
  onWidthChange?: (width: number) => void;
}

export function ResizablePanel({
  children,
  minWidth = 250,
  maxWidth = 600,
  defaultWidth = 300,
  storageKey,
  resizeHandle = 'left',
  className = '',
  style = {},
  onWidthChange,
}: ResizablePanelProps) {
  // Load initial width from localStorage or use default. On the server there is no storage, so the default is used.
  const [width, setWidth] = useState<number>(() => {
    if (storageKey && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = parseInt(stored, 10);
        return Math.max(minWidth, Math.min(maxWidth, parsed));
      }
    }
    return defaultWidth;
  });

  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Save to localStorage when width changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, String(width));
    }
    onWidthChange?.(width);
  }, [width, storageKey, onWidthChange]);

  // Handle mouse down on resize handle
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  };

  // Handle mouse move during drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX =
        resizeHandle === 'right' ? e.clientX - startXRef.current : startXRef.current - e.clientX;
      const newWidth = startWidthRef.current + deltaX;
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minWidth, maxWidth, resizeHandle]);

  // Apply cursor style to body during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isDragging]);

  return (
    <div
      ref={panelRef}
      className={`resizable-panel ${className}`}
      style={{ ...style, width: `${width}px` }}
      data-resizing={isDragging}
    >
      {resizeHandle === 'left' && (
        <div
          className="resize-handle resize-handle-left"
          onMouseDown={handleMouseDown}
          data-active={isDragging}
        >
          <div className="resize-handle-indicator" />
        </div>
      )}

      <div className="resizable-panel-content">{children}</div>

      {resizeHandle === 'right' && (
        <div
          className="resize-handle resize-handle-right"
          onMouseDown={handleMouseDown}
          data-active={isDragging}
        >
          <div className="resize-handle-indicator" />
        </div>
      )}
    </div>
  );
}
