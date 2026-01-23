import React from 'react';
import { ConnectionLineComponentProps } from 'reactflow';

/**
 * ConnectionLine component
 *
 * Custom connection line renderer for React Flow.
 * Displayed while dragging a connection from one handle to another.
 *
 * Features:
 * - Smooth bezier curves
 * - Color-coded by type
 * - Animated while dragging
 */
export const ConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
}) => {
  // TODO: Implement custom connection line
  // - Calculate bezier curve path
  // - Add type-based coloring
  // - Add animation

  return (
    <g>
      <path
        fill="none"
        stroke="#b1b1b7"
        strokeWidth={2}
        d={`M${fromX},${fromY} L${toX},${toY}`}
        style={connectionLineStyle}
      />
    </g>
  );
};
