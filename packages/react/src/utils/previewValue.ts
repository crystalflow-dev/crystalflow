/** The longest text a node shows for one output before it is cut. */
export const PREVIEW_LENGTH = 32;

/**
 * Short text for one output of a node, as shown on the node after a run.
 * A list reads as its size and an object as its JSON, where String() would give "[object Object]".
 */
export function previewValue(value: unknown, max: number = PREVIEW_LENGTH): string {
  let text: string;
  if (Array.isArray(value)) {
    text = `${value.length} ${value.length === 1 ? 'item' : 'items'}`;
  } else if (value !== null && typeof value === 'object') {
    try {
      text = JSON.stringify(value) ?? String(value);
    } catch {
      // a value that points back at itself has no JSON
      text = String(value);
    }
  } else {
    text = String(value);
  }
  return text.length > max ? `${text.slice(0, max)}...` : text;
}
