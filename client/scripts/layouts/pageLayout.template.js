import profile from "@/assets/profile.jpg";

export function getSidebarTemplate() {
	const template = document.createElement("template");
	template.innerHTML = `
  <nav class="page__sidebar sidebar" data-js="page-sidebar">
    <a class="sidebar__item" href="/" data-navigo>
      <svg class="sidebar__icon">
        <use href="./icons.svg#house"></use>
      </svg>
      <span class="sidebar__label">Главная</span>
    </a>

    <a class="sidebar__item" href="/profile" data-navigo>
      <div class="sidebar__icon">
        <img
          class="sidebar__image"
          src="${profile}"
        />
      </div>
      <span class="sidebar__label">Профиль</span>
    </a>
  </nav>`;

	return template.content;
}

export function getFooterTemplate() {
	const template = document.createElement("template");
	template.innerHTML = `
    <footer class="page__footer" data-js="page-footer"></footer>
  `;

	return template.content;
}
