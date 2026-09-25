import poster from "@/assets/cinema.svg?url";

const CONTENT = {
	login: {
		submitLabel: "Войти",
		switchLabel: "Создать новый аккаунт",
		switchHref: "/register",
	},
	register: {
		submitLabel: "Создать",
		switchLabel: "Войти в аккаунт",
		switchHref: "/login",
	},
};

export default function getAuthTemplate(mode) {
	const { submitLabel, switchLabel, switchHref } = CONTENT[mode];
	const template = document.createElement("template");

	template.innerHTML = `
    <div class="auth">
      <div class="auth__media">
        <p class="auth__slogan">Место, где
          <span class="auth__highlight">каждый</span> кадр становится 
          <span class="auth__highlight">воспоминанием</span>.
        </p>
        <img class="auth__image" src="${poster}" alt="Кинотеатр">
      </div>

      <div class="auth__content">
        <h2 class="auth__caption">Войти в Cinema</h2>
        <form class="auth__form" data-js="auth-form">
          ${getEmailTemplate()}
          ${getPasswordTemplate("password", "Пароль")}
          
          ${mode === "register" ? getPasswordTemplate("confirm", "Повторите пароль") : ""}

          <div class="auth__actions">
            <button class="auth__button auth__button--submit" type="submit">${submitLabel}</button>
            <a class="auth__button auth__button--switch"
            href="${switchHref}" data-navigo >${switchLabel}</a>
          </div>
        </form>
      </div>
    </div>
  `;

	return template.content.cloneNode(true);
}

function getEmailTemplate() {
	return `
    <div class="field">
      <div class="field__wrapper">
        <input id="email" class="field__input" name="email" type="text"
          placeholder=" " autocomplete="off" />
        <label class="field__label" for="email">Электронная почта</label>
      </div>
      <span class="field__error" data-js="email-error"></span>
    </div>
  `;
}

function getPasswordTemplate(name, label) {
	return `
    <div class="field">
      <div class="field__wrapper">
        <input
          id="${name}"
          class="field__input"
          name="${name}"
          data-js="${name}-input"
          type="password"
          placeholder=" "
          autocomplete="off"/>
        <label class="field__label" for="${name}">${label}</label>
        <button class="field__toggle" data-js="${name}-toggle" type="button">
          <svg class="field__icon">
            <use data-js="${name}-icon" href="./icons.svg#eye-closed"></use>
          </svg>
        </button>
      </div>
      <span class="field__error" data-js="${name}-error"></span>
    </div>
  `;
}
