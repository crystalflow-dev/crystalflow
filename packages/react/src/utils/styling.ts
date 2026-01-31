/**
 * Utility functions for styling
 */

/**
 * Merges multiple class names into a single string
 * Filters out falsy values
 *
 * @example
 * cn('base', condition && 'active', 'other') // 'base active other'
 * cn('base', false && 'hidden') // 'base'
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Merges multiple style objects
 * Later styles override earlier ones
 *
 * @example
 * mergeStyles({ color: 'red' }, { fontSize: 14 }) // { color: 'red', fontSize: 14 }
 * mergeStyles({ color: 'red' }, { color: 'blue' }) // { color: 'blue' }
 */
export function mergeStyles(...styles: (React.CSSProperties | undefined)[]): React.CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}
