/**
 * TypeScript declarations for CSS imports with ?raw suffix
 * Allows importing CSS files as strings in TypeScript
 */

declare module '*.css?raw' {
  const content: string;
  export default content;
}

/**
 * Vite import.meta.glob type declarations
 */
interface ImportMeta {
  glob: <T = any>(
    pattern: string,
    options?: {
      query?: string;
      eager?: boolean;
      import?: string;
    }
  ) => Record<string, T>;
}
