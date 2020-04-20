class AnimatedConsumptionCard extends HTMLElement {

  set hass(hass) {

    if (!this.content) {
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.style.padding = '16px';
      card.appendChild(this.content);
      this.appendChild(card);

      var obj = this;
      requestAnimationFrame(function(timestamp){
        obj.updateCircle(timestamp);
      });
    }

    try {
      this.updateProperties(hass);
      this.updateContent();
    } catch (err) {
      this.content.innerHTML = `
      <div class="acc_error">
        <b>${err}</b>
        <br><br>
        type: 'custom:animated-consumption-card'
      </div>`;
      this.content.style.backgroundColor = '#ff353d';
      this.content.style.color = 'white';
    }

  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define "entity"');
    }
    this.config = config;

    this.speed = 0;
    this.maxPosition = 500;

    this.circle = `<circle r="10" cx="50" cy="20" fill="#00a6f8"/>`;
  }

  updateProperties(hass) {

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
          throw new Error('This card can work only with entities that has unit_of_measurement "W" or "kW"');
        }

        if (value > 0.2) {
          value = Math.round(value * 10) / 10
        } else {
          value = Math.round(value * 1000) / 1000
        }
    }

    this.value = value;
    this.unit_of_measurement = 'kW';

    // value    speed
    // 1kW      0.1
    // 15kW     2
    this.speed = this.value * 0.135714285714;

    if (this.speed === 0) {
      this.currentPosition = -10;
    }
  }

  updateContent() {
    var svg = '';

    if (this.value > 0) {
        svg = `

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="20px"
        viewBox="0 0 500 40"
        preserveAspectRatio="xMidYMid slice"
      >

        ${this.circle}

      </svg>
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

  updateCircle(timestamp) {

    if (this.currentPosition === undefined) {
      this.currentPosition = -10;
    }

    if (this.prevTimestamp === undefined) {
      this.prevTimestamp = timestamp;
    }

    var timePassed = timestamp - this.prevTimestamp;
    var deltaPosition = this.speed * timePassed;
    this.currentPosition += deltaPosition;

    if (this.currentPosition > this.maxPosition) {
        this.currentPosition = -10;
    }

    this.prevTimestamp = timestamp;

    this.circle = `<circle r="10" cx="${this.currentPosition}" cy="20" fill="#00a6f8"/>`;

    this.updateContent();

    var obj = this;
    requestAnimationFrame(function(timestamp){
      obj.updateCircle(timestamp);
    });
  }
}

customElements.define('animated-consumption-card', AnimatedConsumptionCard);
