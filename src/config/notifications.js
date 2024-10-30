import { Notify } from 'quasar';

/**
 * @typedef {Object} NotificationConfig
 * @property {string} message - El mensaje de la notificación.
 * @property {'top' | 'bottom' | 'left' | 'right'} [position] - La posición de la notificación.
 * @property {string} [textColor] - El color del texto.
 * @property {string} [color] - El color de fondo.
 * @property {boolean} [multiLine] - Si la notificación debe ser de múltiples líneas.
 */

/**
 * Muestra una notificación de éxito.
 * @param {NotificationConfig} config - La configuración de la notificación.
 */
export function notifySuccess({
  message,
  position = 'top',
  textColor = 'white',
  color = 'blue',
  multiLine = true
}) {
  Notify.create({ message, type: 'positive', position, textColor, color, multiLine });
}

/**
 * Muestra una notificación de error.
 * @param {NotificationConfig} config - La configuración de la notificación.
 */
export function notifyError({
  message,
  position = 'top',
  textColor = 'white',
  color = 'red',
  multiLine = true
}) {
  Notify.create({ message, type: 'negative', position, textColor, color, multiLine });
}