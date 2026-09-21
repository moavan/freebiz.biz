(() => {
  const cards = [...document.querySelectorAll('.post-card')];
  const search = document.querySelector('#blog-search');
  const filters = [...document.querySelectorAll('.filter')];
  if (!search) return;
  let category = '전체';
  function update() {
    const query = search.value.trim().toLocaleLowerCase('ko');
    let count = 0;
    for (const card of cards) {
      const visible = (category === '전체' || card.dataset.category === category) && card.textContent.toLocaleLowerCase('ko').includes(query);
      card.hidden = !visible;
      if (visible) count++;
    }
    document.querySelector('#post-count').textContent = count + '편';
    document.querySelector('#empty-message').hidden = count !== 0;
  }
  search.addEventListener('input', update);
  for (const button of filters) button.addEventListener('click', () => {
    category = button.dataset.category;
    for (const other of filters) other.setAttribute('aria-pressed', String(other === button));
    update();
  });
})();
