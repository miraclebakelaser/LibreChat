import copy from 'copy-to-clipboard';
import { InfoIcon } from 'lucide-react';
import React, { useRef, useState, RefObject, useEffect, useCallback } from 'react';
import Clipboard from '~/components/svg/Clipboard';
import CheckMark from '~/components/svg/CheckMark';
import cn from '~/utils/cn';

type CodeBarProps = {
  lang: string;
  codeRef: RefObject<HTMLElement>;
  plugin?: boolean;
  error?: boolean;
};

type CodeBlockProps = Pick<CodeBarProps, 'lang' | 'plugin' | 'error'> & {
  codeChildren: React.ReactNode;
  classProp?: string;
};

const CodeBar: React.FC<CodeBarProps> = React.memo(({ lang, codeRef, error, plugin = null }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyCode = useCallback(() => {
    const codeString = codeRef.current?.textContent;
    if (codeString) {
      setIsCopied(true);
      copy(codeString);

      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  }, [codeRef]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey && event.shiftKey && event.key === ';') {
        event.preventDefault();
        copyCode();
      }
    },
    [copyCode],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="relative flex items-center rounded-tl-md rounded-tr-md bg-gray-700 px-4 py-2 font-sans text-xs text-gray-200 dark:bg-gray-700">
      <span className="">{lang}</span>
      {plugin ? (
        <InfoIcon className="ml-auto flex h-4 w-4 gap-2 text-white/50" />
      ) : (
        <button
          className={cn('ml-auto flex gap-2', error ? 'h-4 w-4 items-start text-white/50' : '')}
          onClick={copyCode}
        >
          {isCopied ? (
            <>
              <CheckMark />
              {error ? '' : 'Copied!'}
            </>
          ) : (
            <>
              <Clipboard />
              {error ? '' : 'Copy code'}
            </>
          )}
        </button>
      )}
    </div>
  );
});

const CodeBlock: React.FC<CodeBlockProps> = ({
  lang,
  codeChildren,
  classProp = '',
  plugin = null,
  error,
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const language = plugin || error ? 'json' : lang;

  return (
    <div className="w-full rounded-md bg-gray-900 text-xs text-white/80">
      <CodeBar lang={lang} codeRef={codeRef} plugin={!!plugin} error={error} />
      <div className={cn(classProp, 'overflow-y-auto p-4')}>
        <code
          ref={codeRef}
          className={cn(
            plugin || error ? '!whitespace-pre-wrap' : `hljs language-${language} !whitespace-pre`,
          )}
        >
          {codeChildren}
        </code>
      </div>
    </div>
  );
};

export default CodeBlock;
