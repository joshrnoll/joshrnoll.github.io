function copyFromSelection(text: string): boolean {
  const focused = document.activeElement;
  const field = document.createElement('textarea');
  field.value = text;
  field.readOnly = true;
  field.style.cssText = 'position: fixed; top: 0; left: -9999px;';
  document.body.append(field);
  field.focus({ preventScroll: true });
  field.select();
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    field.remove();
    if (focused instanceof HTMLElement) focused.focus({ preventScroll: true });
  }
}

async function copyCode(text: string) {
  try {
    if (!navigator.clipboard) return copyFromSelection(text);
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyFromSelection(text);
  }
}

export function mountCodeCopy() {
  for (const pre of document.querySelectorAll('main pre')) {
    const code = pre.querySelector('code');
    if (!code || pre.parentElement?.classList.contains('code-block')) continue;

    const block = document.createElement('div');
    block.className = 'code-block';
    const rail = document.createElement('div');
    rail.className = 'code-copy-rail';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.setAttribute('aria-label', 'Copy code');
    button.innerHTML = `
      <svg class="chalk-stroke" viewBox="0 0 26 26" aria-hidden="true">
        <path class="copy-clipboard" d="M9 5 5 6 5.6 22.3 21 22 20.7 5.6 17 5.5 M9.2 4.2Q13 3.5 16.8 4.1L17.1 8 8.8 8.2Z M9.1 12.6l7.3-.3 M9 16.4l7.1.2" />
        <path class="copy-check" d="M4.8 13.9q3.3 2.4 5.4 5.3Q16 12.8 22 6.3 M10.4 19.7q4.9-6 9.9-10.9" />
      </svg>`;
    const status = document.createElement('span');
    status.className = 'copy-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    let reset: number | undefined;

    button.addEventListener('click', async () => {
      window.clearTimeout(reset);
      status.textContent = '';
      const copied = await copyCode(code.innerText);
      button.classList.toggle('copied', copied);
      status.textContent = copied ? 'copied!' : 'copy failed';
      reset = window.setTimeout(() => {
        button.classList.remove('copied');
        status.textContent = '';
      }, 2000);
    });

    pre.replaceWith(block);
    rail.append(button, status);
    block.append(pre, rail);
  }
}
