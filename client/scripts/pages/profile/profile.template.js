export default function getProfileTemplate() {
	const template = document.createElement("template");
	template.innerHTML = `
    <div class="profile">
      <div class="profile__wrapper">
        <div class="profile__info">
          <div class="profile__avatar">
            <img 
              class="profile__image" 
              data-js="profile-avatar"
              src="" 
              alt="avatar" 
               >
          </div>
          <div class="profile__email" data-js="profile-email"></div>
        </div>

        <div class="profile__options">
          <div class="file">
            <input
              id="fileInput" 
              class="file__input" 
              data-js="profile-upload"
              type="file" 
              accept="image/*" 
            />
            <label class="file__button" for="fileInput">
              Загрузить фото профиля
            </label>
          </div>
        
          <button 
            class="profile__button profile__button--logout"
            data-js="profile-logout" 
            type="button"
          >Выйти из аккаунта</button>
        </div>
      </div>
		</div>
  `;

	return template.content;
}
