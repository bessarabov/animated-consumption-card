# animated-consumption-card

This is a repo with Home Assistant custom ui card `animated-consumption-card`.

This card shows a simple animation how much resources your house is consuming:

![](https://user-images.githubusercontent.com/47263/80096346-18f9a000-8572-11ea-816b-c07a2871ddd6.gif)

To use it you need to have a sensor in Home Assistant with your consumtion and pass it
to this UI card. The sensor must have `unit_of_measurement` `W` or `kW`.

## Installation

 * Copy file `animated-consumption-card.js` to `/config/www/animated-consumption-card.js`
 * Check that you can see this file as http://hassio.local:8123/local/animated-consumption-card.js (restart HA if you can't)
 * Add `/local/animated-consumption-card.js` as `JavaScript Module` in HA config http://hassio.local:8123/config/lovelace/resources
 * Add card to your lovelace ui:

```
      - type: 'custom:animated-consumption-card'
        entity: sensor.total_power_consumption
```
