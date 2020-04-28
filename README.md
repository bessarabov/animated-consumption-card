# animated-consumption-card

This is a repo with Home Assistant custom ui card `animated-consumption-card`.

This card shows a simple animation how much resources your house is consuming:

![](https://user-images.githubusercontent.com/47263/80096346-18f9a000-8572-11ea-816b-c07a2871ddd6.gif)

To use it you need to have a sensor in Home Assistant with your consumtion and pass it
to this UI card. The sensor must have `unit_of_measurement` `W` or `kW`.

## Installation

There are several ways, you can add this card to your Home Assistant.

### Manual installation

 * Copy file `animated-consumption-card.js` to `/config/www/animated-consumption-card.js`
 * Check that you can see this file as http://hassio.local:8123/local/animated-consumption-card.js (restart HA if you can't)
 * Add `/local/animated-consumption-card.js` as `JavaScript Module` in HA config http://hassio.local:8123/config/lovelace/resources

### Installation with HACS

If you use HACS, you can install this card with HACS (but HACS is not required,
if you don't use HACS you can install this card using the steps described in the previous section)

To install this card with HACS just use the standart HACS way to install
cards from the custom GitHub repository.

## Configuration

When you have this card installed in your Home Assistant you can use it. Add to your
lovelace ui:

```
      - type: 'custom:animated-consumption-card'
        entity: sensor.total_power_consumption
```

The field `entity` is required. The `unit_of_measurement` of this entity must be `W` or `kW`.

There are also several configuration parameters. Thery are not required,
but you can use it to customize the card.

| Name | Default value | Description |
| --- | --- | --- |
| **left_icon** | `mdi:electron-framework` | Left icon in the card |
| **right_icon** | `mdi:home` | Right icon in the card |
| **show_line** | `false` | Showing a line between icons |
