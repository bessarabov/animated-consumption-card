# animated-consumption-card

This is a repo with Home Assistant custom ui card `animated-consumption-card`.

## Installation

 * Copy file `animated-consumption-card.js` to `/config/www/animated-consumption-card.js`
 * Check that you can see this file as http://hassio.local:8123/local/animated-consumption-card.js (restart HA if you can't)
 * Add `/local/animated-consumption-card.js` as `JavaScript Module` in HA config http://hassio.local:8123/config/lovelace/resources
 * Add card to your lovelace ui:

```
  - type: 'custom:animated-consumption-card'
    entity: sensor.total_power_consumption
```
