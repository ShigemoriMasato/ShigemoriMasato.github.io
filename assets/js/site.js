(() => {
  const cards = [...document.querySelectorAll('.work-card')];
  const count = document.querySelector('#work-count');
  const filters = [...document.querySelectorAll('.filter')];
  if (count) count.textContent = String(cards.length).padStart(2, '0');

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      cards.forEach((card) => {
        card.hidden = category === 'favorite'
          ? card.dataset.favorite !== 'true'
          : category !== 'all' && card.dataset.category !== category;
      });
      if (count) count.textContent = String(cards.filter((card) => !card.hidden).length).padStart(2, '0');
    });
  });

  const engineLink = document.querySelector('#engine-link');
  if (engineLink) {
    const openEngineLink = () => {
      const url = engineLink.dataset.url;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };
    engineLink.addEventListener('dblclick', openEngineLink);
    engineLink.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openEngineLink();
      }
    });
  }

  const dialog = document.querySelector('#project-dialog');
  if (dialog) {
    const title = dialog.querySelector('#dialog-title');
    const image = dialog.querySelector('.dialog-image');
    const meta = dialog.querySelector('.dialog-meta');
    const description = dialog.querySelector('.dialog-description');
    const tags = dialog.querySelector('.dialog-tags');
    const links = dialog.querySelector('.dialog-links');
    const closeButton = dialog.querySelector('.dialog-close');
    const iconMarkup = {
      github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.59 1.2 3.22.92.1-.71.39-1.2.7-1.48-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.77 1.15 2.99 0 4.3-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>',
      download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v9.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"/></svg>'
    };
    const openProject = (card) => {
      title.textContent = card.dataset.title || card.querySelector('h3')?.textContent || '';
      image.src = card.dataset.image || '';
      image.alt = `${title.textContent} の画像`;
      meta.textContent = `${(card.dataset.category || '').toUpperCase()}${card.dataset.period ? ` / ${card.dataset.period}` : ''}`;
      description.textContent = card.dataset.description || card.querySelector(':scope > p')?.textContent || '';
      tags.replaceChildren(...[...card.querySelectorAll('.work-tags span')].map((tag) => {
        const chip = document.createElement('span');
        chip.textContent = tag.textContent;
        return chip;
      }));
      links.replaceChildren();
      [['github', 'GitHub'], ['download', 'Download']].forEach(([key, label]) => {
        if (!card.dataset[key]) return;
        const link = document.createElement('a');
        link.className = `project-link project-link-${key}`;
        link.href = card.dataset[key];
        link.setAttribute('aria-label', label);
        link.title = label;
        link.innerHTML = iconMarkup[key];
        if (key === 'github') {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        } else {
          link.setAttribute('download', '');
        }
        links.append(link);
      });
      dialog.showModal();
      document.body.classList.add('dialog-open');
      closeButton.focus();
    };

    cards.forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${card.dataset.title || card.querySelector('h3')?.textContent || '作品'} の詳細を表示`);
      card.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        openProject(card);
      });
      card.addEventListener('keydown', (event) => {
        if (event.target !== card || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        openProject(card);
      });
    });
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  }
})();
