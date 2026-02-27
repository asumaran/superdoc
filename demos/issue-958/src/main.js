import { SuperDoc } from '@harbour-enterprises/superdoc';
import '@harbour-enterprises/superdoc/style.css';

const resultsEl = document.getElementById('results');

function log(msg, isError = false) {
  const line = document.createElement('div');
  line.className = isError ? 'error' : 'success';
  line.textContent = msg;
  resultsEl.appendChild(line);
  console.log(msg);
}

function clearResults() {
  while (resultsEl.firstChild) {
    resultsEl.removeChild(resultsEl.firstChild);
  }
}

/**
 * Reporter's exact pattern from issue #958
 */
function getTotalPage(file) {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-9999px;top:0;width:800px;height:600px;';
    document.body.appendChild(container);

    const sd = new SuperDoc({
      selector: container,
      document: file,
      pagination: true,
      onReady: (event) => {
        const totalPages = event.superdoc.activeEditor.currentTotalPages;
        log(`onReady — currentTotalPages = ${totalPages} (type: ${typeof totalPages})`);

        if (totalPages === undefined) {
          log('BUG: currentTotalPages is undefined', true);
        } else {
          log(`OK: page count = ${totalPages}`);
        }

        try {
          event.superdoc.destroy();
          log('destroy() OK');
        } catch (err) {
          log(`destroy() crashed: ${err.message}`, true);
        }

        container.remove();
        resolve(totalPages);
      },
    });
  });
}

document.getElementById('file-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  clearResults();
  log(`Loading: ${file.name}`);

  const result = await getTotalPage(file);
  log(`Result: ${result}`);
});
