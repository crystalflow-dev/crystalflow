import KitScripts from '@/components/next/KitScripts';
import { paletteCss } from '@/lib/palette';

const kitStyles = [
  '/assets/system.css',
  '/assets/ui/cards.css',
  '/assets/motion/motion.css',
  '/assets/backgrounds/backgrounds.css',
  '/assets/layout/layout.css',
  '/assets/icons/icon.css',
  '/assets/ui/base.css',
];

const tokens = `${paletteCss()}
:root {
  --font-display: "Manrope", system-ui, sans-serif;
  --font-text: "Manrope", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --display-weight: 500;
  --display-tracking: -0.035em;
  --display-tracking-xl: -0.045em;
  --ly-scale: 0.97;
}`;

const enter =
  "document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)";

/** The document every page is rendered in: the kit's stylesheets, the palette and the scripts. */
export default function SiteDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-type="software"
      data-radius="sharp"
      data-buttons="solid"
      data-motion=""
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400..700&family=JetBrains+Mono:wght@400..500&display=swap"
          rel="stylesheet"
        />
        {kitStyles.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <style dangerouslySetInnerHTML={{ __html: tokens }} />
        <script dangerouslySetInnerHTML={{ __html: enter }} />
        <script src="/assets/backgrounds/backgrounds.js" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <KitScripts />
      </body>
    </html>
  );
}
