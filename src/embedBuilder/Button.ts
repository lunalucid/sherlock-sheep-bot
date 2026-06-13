import { APIButtonComponent, APIButtonComponentWithSKUId, APIButtonComponentWithURL, APIMessageComponentEmoji, ComponentType, ButtonStyle } from 'discord.js'

const Primary = (
  label?: string,
  id?: string,
  customId?: string,
  emoji?: APIMessageComponentEmoji,
  disabled?: boolean,
): APIButtonComponent => {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Primary,
    label: label,
    custom_id: customId || id || 'primary_button',
    emoji,
    disabled: disabled || false,
  }
}

const Secondary = (
  label?: string,
  id?: string,
  customId?: string,
  emoji?: APIMessageComponentEmoji,
  disabled?: boolean,
): APIButtonComponent => {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Secondary,
    label: label,
    custom_id: customId || id || 'secondary_button',
    emoji,
    disabled: disabled || false,
  }
}

const Success = (
  label?: string,
  id?: string,
  customId?: string,
  emoji?: APIMessageComponentEmoji,
  disabled?: boolean,
): APIButtonComponent => {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Success,
    label: label,
    custom_id: customId || id || 'success_button',
    emoji,
    disabled: disabled || false,
  }
}

const Danger = (
  label?: string,
  id?: string,
  customId?: string,
  emoji?: APIMessageComponentEmoji,
  disabled?: boolean,
): APIButtonComponent => {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Danger,
    label: label,
    custom_id: customId || id || 'danger_button',
    emoji,
    disabled: disabled || false,
  }
}

const Link = (
  label: string,
  url: string,
  disabled: boolean = false,
): APIButtonComponentWithURL => {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Link,
    label,
    url,
    disabled,
  } as APIButtonComponentWithURL;
}

const Premium = (
  skuId: string,
  disabled?: boolean,
  id?: string,
): APIButtonComponentWithSKUId => {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Premium,
    sku_id: skuId,
    disabled: disabled || false,
    id: id,
  } as APIButtonComponentWithSKUId;
}

export const Button = { Primary, Secondary, Success, Danger, Link, Premium };