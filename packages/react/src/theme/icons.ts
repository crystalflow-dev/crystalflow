/**
 * Icon mapping system using react-icons
 * Centralized icon definitions for consistency across the app
 */

import * as FiIcons from 'react-icons/fi';
import type { IconType } from 'react-icons';

// Category icons for Node Palette
export const categoryIcons: Record<string, IconType> = {
  'Data Processing': FiIcons.FiDatabase,
  Mathematics: FiIcons.FiHash,
  Math: FiIcons.FiHash,
  Network: FiIcons.FiGlobe,
  Logic: FiIcons.FiCode,
  Time: FiIcons.FiCalendar,
  Input: FiIcons.FiEdit3,
  Output: FiIcons.FiEye,
  Transform: FiIcons.FiRepeat,
  Analytics: FiIcons.FiTrendingUp,
  Control: FiIcons.FiSliders,
  Examples: FiIcons.FiLayers,
};

// Node status icons
export const statusIcons = {
  idle: FiIcons.FiCircle,
  running: FiIcons.FiZap,
  success: FiIcons.FiCheck,
  error: FiIcons.FiAlertCircle,
  warning: FiIcons.FiAlertTriangle,
} as const;

// UI icons
export const uiIcons = {
  settings: FiIcons.FiSettings,
  chevronDown: FiIcons.FiChevronDown,
  chevronRight: FiIcons.FiChevronRight,
  search: FiIcons.FiSearch,
  close: FiIcons.FiX,
  moreVertical: FiIcons.FiMoreVertical,
  save: FiIcons.FiSave,
  load: FiIcons.FiUpload,
  execute: FiIcons.FiPlay,
  clear: FiIcons.FiTrash2,
  plus: FiIcons.FiPlus,
  minus: FiIcons.FiMinus,
  info: FiIcons.FiInfo,
  help: FiIcons.FiHelpCircle,
  filter: FiIcons.FiFilter,
  refresh: FiIcons.FiRefreshCw,
} as const;

// Handle icons
export const handleIcons = {
  input: FiIcons.FiArrowRight,
  output: FiIcons.FiArrowLeft,
} as const;

// Get icon for category (with fallback)
export function getCategoryIcon(category: string): IconType {
  return categoryIcons[category] || FiIcons.FiBox;
}

// Get icon for node status
export function getStatusIcon(status: keyof typeof statusIcons): IconType {
  return statusIcons[status];
}
