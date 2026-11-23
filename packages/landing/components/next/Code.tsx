import { highlight, type Lang } from '@/lib/highlight';

/** A snippet as coloured spans. The colours are the .cf-tok rules in next.css. */
export default function Code({ code, lang }: { code: string; lang: Lang }) {
  return (
    <>
      {highlight(code, lang).map((token, i) =>
        token.kind ? (
          <span key={i} className={`cf-tok cf-tok--${token.kind}`}>
            {token.text}
          </span>
        ) : (
          token.text
        )
      )}
    </>
  );
}
