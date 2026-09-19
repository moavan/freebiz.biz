(() => {
  const input = document.querySelector('#guide-search');
  if (input) {
    const cards = [...document.querySelectorAll('.guide-card')];
    const buttons = [...document.querySelectorAll('.filter')];
    const count = document.querySelector('#result-count');
    const empty = document.querySelector('#no-results');
    let category = 'all';
    const update = () => {
      const words = input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
      let shown = 0;
      cards.forEach(card => {
        const matches = (category === 'all' || card.dataset.category === category)
          && words.every(word => card.textContent.toLocaleLowerCase().includes(word));
        card.hidden = !matches;
        if (matches) shown++;
      });
      count.textContent = `${category === 'all' ? '전체 글' : category} ${shown}편`;
      empty.hidden = shown !== 0;
    };
    input.addEventListener('input', update);
    buttons.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.category;
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      update();
    }));
  }
  const copy = document.querySelector('.copy-link');
  if (copy) copy.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      const url = new URL(location.href);
      url.hash = '';
      await navigator.clipboard.writeText(url.href);
      status.textContent = '링크를 복사했습니다.';
    } catch {
      status.textContent = '주소창의 링크를 복사해 주세요.';
    }
  });
})();
