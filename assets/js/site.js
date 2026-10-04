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
        card.hidden = category !== 'all' && card.dataset.category !== category;
      });
    });
  });
})();
