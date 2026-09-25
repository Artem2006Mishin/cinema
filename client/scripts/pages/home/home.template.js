export default function getHomeTemplate() {
	const template = document.createElement("template");
	template.innerHTML = `
    <div class="reservation">
			<div class="reservation__movies">
				<div class="drum" data-js="drum">
					<ul class="drum__list" data-js="drum-list"></ul>
				</div>
			</div>

      <div class="reservation__main">
        <ul class="reservation__legend">
          <li class="reservation__legend-item">
            <div class="seat"></div>
            <span class="reservation__legend-text">Свободно</span>
          </li>
          <li class="reservation__legend-item">
            <div class="seat seat--selected"></div>
            <span class="reservation__legend-text">Выбрано</span>
          </li>
          <li class="reservation__legend-item">
            <div class="seat seat--occupied"></div>
            <span class="reservation__legend-text">Занято</span>
          </li>
        </ul>

        <div class="cinema">
          <div class="cinema__screen"></div>
          <div class="cinema__hall"></div>
        </div>


        <p class="reservation__receipt">
          Выбрано
          <span id="selected-seat-count" class="reservation__receipt-span">
            0
          </span>
          сидений, итоговая стоимость
          <span id="total-price" class="reservation__receipt-span">
            0
          </span>
          ₽
        </p>

        <button
          class="reservation__button reservation__button--inactive"
          type="button"
          disabled
          >
          Забронировать
        </button>
      </div>
		</div>
  `;

	return template.content.cloneNode(true);
}
