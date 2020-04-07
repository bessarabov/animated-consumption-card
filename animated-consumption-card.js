class AnimatedConsumptionCard extends HTMLElement {
  set hass(hass) {
    console.log('hass()');

    if (!this.content) {
      console.log("!this.content");

      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.style.padding = '16px';
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const entityId = this.config.entity;
    const state = hass.states[entityId];
    var valueStr = state ? state.state : 'unavailable';

    const unit_of_measurement = state ? state.attributes.unit_of_measurement : '-';

    var kWValue;

    if (unit_of_measurement === 'kW') {
      kWValue = valueStr * 1;
    } else if (unit_of_measurement === 'W') {
      kWValue = valueStr / 1000;
    } else {
      console.log('ERROR');
    }

    if (kWValue > 0.2) {
      kWValue = Math.round(kWValue * 10) / 10
    } else {
      kWValue = Math.round(kWValue * 1000) / 1000
    }

    var svg = '';

    if (kWValue > 0) {

        // if 15 then 0.2s
        // if 0.01 then 5s
        //var duration = 0.3202 * kWValue + 0.1968;
        var duration = -0.3202 * kWValue +5.0032;

        svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="20px" viewBox="0 0 500 40">

            <circle id="bla_circle" r="10" cx="0" cy="20" stroke="#black" fill="green" />

            <animateTransform
                xlink:href="#bla_circle"
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
      .bla_icon {
        height: 80px;
        width: 80px;
        border: 1px solid black;
        border-radius: 100px;
        padding: 22px;
        color: black;
      }

      .bla_text_container {
        position: relative;
        left: 27px;
        top: -29px;
        width: 70px;
      }

      .bla_text {
        text-align: center;
      }

.bla_td {
    vertical-align: top;
}
</style>

<table style="border-collapse: collapse;">
<tr>
    <td class="bla_td">
        <div>
              <ha-icon class="bla_icon" icon="mdi:electron-framework"></ha-icon>
        </div>
    </td>

    <td class="bla_td" style="width: 100%; padding-top: 50px;">
        ${svg}
    </td>

    <td class="bla_td">
        <div class="bla_icon_with_text">
            <ha-icon class="bla_icon" icon="mdi:home"></ha-icon>
            <div class="bla_text_container">
                <div class="bla_text">${kWValue} kW</div>
            </div>
        </div>
    </td>
</tr>
</table>
    `;

  }

  setConfig(config) {
    console.log('setConfig()');
    if (!config.entity) {
      throw new Error('You need to define "entity"');
    }
    this.config = config;
  }
}

customElements.define('animated-consumption-card', AnimatedConsumptionCard);
