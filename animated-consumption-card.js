class AnimatedConsumptionCard extends HTMLElement {

  set hass(hass) {

    if (!this.contentIsCreated) {
      this.createContent();

      var obj = this;
      requestAnimationFrame(function(timestamp){
        obj.updateCircle(timestamp);
      });
    }

    try {
      this.updateProperties(hass);
    } catch (err) {
      this.innerHTML = `
      <div class="acc_error">
        <b>${err}</b>
        <br><br>
        type: 'custom:animated-consumption-card'
      </div>`;
      this.style.padding = '8px';
      this.style.backgroundColor = '#ff353d';
      this.style.color = 'white';
    }

  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define "entity"');
    }

    this.config = config;

    this.leftIcon = 'mdi:electron-framework';
    if (config.left_icon !== undefined) {
      this.leftIcon = config.left_icon;
    }

    this.rightIcon = 'mdi:home';
    if (config.right_icon !== undefined) {
      this.rightIcon = config.right_icon;
    }

    this.showLine = false;
    if (config.show_line) {
      this.showLine = true;
    }

    this.circleColor = "var(--primary-color)";
    if (config.circle_color !== undefined) {
      this.circleColor = config.circle_color;
    }

    this.contentIsCreated = false;

    this.speed = 0;
    this.startPosition = -10;
    this.maxPosition = 500;

    this.value = 0;
    this.unit_of_measurement = '';

    this.accText = undefined;
    this.accCircle = undefined;
  }

  createContent(hass) {
    const card = document.createElement('ha-card');
    var content = document.createElement('div');
    content.style.padding = '16px';
    card.appendChild(content);
    this.appendChild(card);

    var maybeALine = '';
    if (this.showLine) {
      maybeALine = `<line x1="0" y1="20" x2="500" y2="20" style="stroke:var(--primary-text-color);" />`;
    }

    content.innerHTML = `
<style>

.acc_container {
    height: 80px;
    width: 80px;
    border: 1px solid black;
    border-radius: 100px;
    padding: 22px;
    color: var(--primary-text-color);
    border-color: var(--primary-text-color);
}

.acc_icon {
    --mdc-icon-size: 80px;
    height: 80px;
    width: 80px;
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

<table style="border-collapse: collapse;" id='asdf'>
<tr>
    <td class="acc_td">
        <div class="acc_container">
              <ha-icon class="acc_icon" icon="${ this.leftIcon }"></ha-icon>
        </div>
    </td>

    <td class="acc_td" style="width: 100%; padding-top: 50px;">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="20px"
        viewBox="0 0 500 40"
        preserveAspectRatio="xMinYMax slice"
      >
        ${maybeALine}
      </svg>
    </td>

    <td class="acc_td">
        <div class="acc_icon_with_text">
            <div class="acc_container">
                <ha-icon class="acc_icon" icon="${ this.rightIcon }"></ha-icon>
            </div>
            <div class="acc_text_container">
            </div>
        </div>
    </td>
</tr>
</table>
    `;

    this.accText = document.createElement('div');
    this.accText.className = 'acc_text';
    card.querySelectorAll(".acc_text_container").item(0).appendChild(this.accText);

    this.accCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    this.accCircle.setAttributeNS(null, "r", "10");
    this.accCircle.setAttributeNS(null, "cx", this.startPosition);
    this.accCircle.setAttributeNS(null, "cy", "20");
    this.accCircle.setAttributeNS(null, "fill", this.circleColor);
    this.querySelectorAll("svg").item(0).appendChild(this.accCircle);

    this.contentIsCreated = true;
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

    this.accText.innerHTML = this.value + ' ' + this.unit_of_measurement;

    this.speed = this.getSpeed(this.value);

    if (this.speed === 0) {
      this.currentPosition = this.startPosition;
    }
  }

  updateCircle(timestamp) {

    if (this.clientWidth !== 0) {
      this.maxPosition = 2 * this.clientWidth - 570;
    }

    if (this.currentPosition === undefined) {
      this.currentPosition = this.startPosition;
    }

    if (this.prevTimestamp === undefined) {
      this.prevTimestamp = timestamp;
    }

    var timePassed = timestamp - this.prevTimestamp;
    var deltaPosition = this.speed * timePassed;
    this.currentPosition += deltaPosition;

    if (this.currentPosition > this.maxPosition) {
        this.currentPosition = this.startPosition;
    }

    this.prevTimestamp = timestamp;

    this.accCircle.setAttributeNS(null, "cx", this.currentPosition);

    var obj = this;
    requestAnimationFrame(function(timestamp){
      obj.updateCircle(timestamp);
    });
  }

  getSpeed(value) {

    var speed = 0;

    // I have found min & max speed that looks ok to me.
    // And then I have calculated math function
    // using the dots:
    //
    // value    speed
    // 0.001    0.02
    // 15       2

    if (this.value > 0) {
      speed = 0.1320 * this.value + 0.02;
    }

    return speed;
  }

}

customElements.define('animated-consumption-card', AnimatedConsumptionCard);
