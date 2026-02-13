/**
 * InfoPopup Component
 *
 * A reusable popup component for displaying example information
 */

import { useState } from 'react';
import { FiInfo, FiX } from 'react-icons/fi';

interface InfoPopupProps {
  title: string;
  children: React.ReactNode;
}

export function InfoPopup({ title, children }: InfoPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Info Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid var(--color-primary-500)',
          background: 'var(--color-bg-elevated)',
          color: 'var(--color-primary-500)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          boxShadow: 'var(--shadow-md)',
          transition: 'all var(--transition-fast) var(--ease-out)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-primary-500)';
          e.currentTarget.style.color = 'white';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-bg-elevated)';
          e.currentTarget.style.color = 'var(--color-primary-500)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Show example information"
      >
        <FiInfo />
      </button>

      {/* Popup Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
              animation: 'fadeIn 0.2s ease-out',
            }}
          />

          {/* Popup Content */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '80vh',
              background: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 10001,
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: 'var(--space-5)',
                borderBottom: '1px solid var(--color-border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--color-bg-secondary)',
                borderTopLeftRadius: 'var(--radius-lg)',
                borderTopRightRadius: 'var(--radius-lg)',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {title}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all var(--transition-fast) var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
                title="Close"
              >
                <FiX />
              </button>
            </div>

            {/* Content */}
            <div
              style={{
                padding: 'var(--space-5)',
                overflowY: 'auto',
                flex: 1,
                color: 'var(--color-text-primary)',
                lineHeight: '1.6',
              }}
            >
              <div
                className="crystalflow-info-content"
                style={{
                  fontSize: 'var(--font-size-base)',
                }}
              >
                {children}
              </div>
            </div>
          </div>

          {/* Animations */}
          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translate(-50%, -48%);
                }
                to {
                  opacity: 1;
                  transform: translate(-50%, -50%);
                }
              }

              /* InfoPopup content styling */
              .crystalflow-info-content p {
                margin: 0 0 var(--space-3) 0;
                line-height: 1.6;
              }

              .crystalflow-info-content h3 {
                margin: var(--space-5) 0 var(--space-3) 0;
                font-size: var(--font-size-lg);
                font-weight: var(--font-weight-bold);
                color: var(--color-text-primary);
              }

              .crystalflow-info-content h3:first-child {
                margin-top: 0;
              }

              .crystalflow-info-content ul,
              .crystalflow-info-content ol {
                margin: var(--space-3) 0;
                padding-left: var(--space-6);
              }

              .crystalflow-info-content li {
                margin: var(--space-2) 0;
                line-height: 1.6;
              }

              .crystalflow-info-content code {
                padding: 2px 6px;
                background: var(--color-bg-tertiary);
                border: 1px solid var(--color-border-light);
                border-radius: var(--radius-sm);
                font-family: var(--font-family-mono);
                font-size: 0.9em;
                color: var(--color-primary-600);
              }

              .crystalflow-info-content strong {
                font-weight: var(--font-weight-semibold);
                color: var(--color-text-primary);
              }

              .crystalflow-info-content a {
                color: var(--color-primary-500);
                text-decoration: none;
                transition: color var(--transition-fast) var(--ease-out);
              }

              .crystalflow-info-content a:hover {
                color: var(--color-primary-600);
                text-decoration: underline;
              }
            `}
          </style>
        </>
      )}
    </>
  );
}
