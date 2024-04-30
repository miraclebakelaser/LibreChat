/**
 * Insert text at the cursor position in a textarea.
 */
export function insertTextAtCursor(element: HTMLTextAreaElement, textToInsert: string) {
  const { selectionStart, selectionEnd, value } = element;
  const newValue = value.slice(0, selectionStart) + textToInsert + value.slice(selectionEnd);
  element.value = newValue;
  element.selectionStart = element.selectionEnd = selectionStart + textToInsert.length;
  element.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Debounced resize helper for edge cases where paste doesn't update the container height.
 */
export const forceResize = (() => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (textAreaRef: React.RefObject<HTMLTextAreaElement>) => {
    if (!textAreaRef.current) {
      return;
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      textAreaRef.current!.style.height = 'auto';
      textAreaRef.current!.style.height = `${textAreaRef.current!.scrollHeight}px`;
    }, 100);
  };
})();

/**
 * Optimized undo event helper for edge cases where undoing pasted content leaves newlines filling the previous container height.
 */
export const trimUndoneRange = (textAreaRef: React.RefObject<HTMLTextAreaElement>) => {
  if (!textAreaRef.current) {
    return;
  }

  const { selectionStart, value } = textAreaRef.current;
  let i = value.length - 1;

  while (i >= selectionStart && /\s/.test(value[i])) {
    i--;
  }

  textAreaRef.current.value = value.slice(0, i + 1);
  textAreaRef.current.setSelectionRange(selectionStart, selectionStart);
};
/**
 * Resize the textarea based on its content on input event.
 */
export const resizeTextarea = (event: React.FormEvent<HTMLTextAreaElement>) => {
  const textarea = event.currentTarget;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};
