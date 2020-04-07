class AnimatedConsumptionCard extends HTMLElement {

  set hass(hass) {

    if (!this.content) {
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.style.padding = '16px';
      card.appendChild(this.content);
      this.appendChild(card);
    }

    var prevValue = this.value;
    this.setValueAndUnit(hass);

    if (prevValue !== this.value) {
      this.updateContent();
    }

  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define "entity"');
    }
    this.config = config;
  }

  setValueAndUnit(hass) {

    var value;

    const entityId = this.config.entity;
    const state = hass.states[entityId];

    if (state) {
        var valueStr = state.state;
        const unit_of_measurement = state.attributes.unit_of_measurement;

        if (unit_of_measurement === 'kW') {
          value = valueStr * 1;
        } else if (unit_of_measurement === 'W') {
          value = valueStr / 1000;
        } else {
          console.log('ERROR. This code can work only with entities that has unit_of_measurement "W" or "kW"');
        }

        if (value > 0.2) {
          value = Math.round(value * 10) / 10
        } else {
          value = Math.round(value * 1000) / 1000
        }
    }

    this.value = value;
    this.unit_of_measurement = 'kW';

  }

  updateContent() {
    var svg = '';

    if (this.value > 0) {

        const entityId = this.config.entity;
        const animatedElementId = "id_acc_" + entityId;

        // if 15 then 0.2s
        // if 0.01 then 5s
        var duration = -0.3202 * this.value +5.0032;

        svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="20px" viewBox="0 0 500 40">

            <circle id="${animatedElementId}" r="10" cx="0" cy="20" stroke="#black" fill="green" />

            <animateTransform
                xlink:href="#${animatedElementId}"
                attributeName="transform"
                type="translate"
                from="0,0"
                to="490,0"
                dur="${duration}s"
                additive="replace"
                fill="freeze"
                repeatCount="indefinite"
            />

        </svg>
        `;
    }

    this.content.innerHTML = `
<style>

.acc_icon {
    height: 80px;
    width: 80px;
    border: 1px solid black;
    border-radius: 100px;
    padding: 22px;
    color: black;
}

.acc_text_container {
    position: relative;
    left: 27px;
    top: -29px;
    width: 70px;
}

.acc_text {
    text-align: center;
}

.acc_td {
    vertical-align: top;
}
</style>

<table style="border-collapse: collapse;">
<tr>
    <td class="acc_td">
        <div>
              <ha-icon class="acc_icon" icon="mdi:electron-framework"></ha-icon>
        </div>
    </td>

    <td class="acc_td" style="width: 100%; padding-top: 50px;">
        ${svg}
    </td>

    <td class="acc_td">
        <div class="acc_icon_with_text">
            <ha-icon class="acc_icon" icon="mdi:home"></ha-icon>
            <div class="acc_text_container">
                <div class="acc_text">${ this.value } ${ this.unit_of_measurement }</div>
            </div>
        </div>
    </td>
</tr>
</table>
    `;
  }
}

customElements.define('animated-consumption-card', AnimatedConsumptionCard);
