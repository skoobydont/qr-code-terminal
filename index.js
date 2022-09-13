const prompt = require('prompt');
const qrcode = require('wifi-qr-code-generator');
const process = require('process');
/**
 * Define Input Schema
 */
const schema = {
  properties: {
    name: {
      pattern: /^[a-zA-Z0-9\s\-\']+$/,
      message: 'Name must be only letters, spaces, dashes, or single quotes',
      required: true,
    },
    password: {
      hidden: true,
    },
  },
};
/**
 * Handle Prompt Input
 * @async
 * @param {any} error any prompt errors
 * @param {{ name, password }} result the user input for wifi name & pwd
 * @returns {any} exit code based on result & any errors
 */
async function handlePromptInput(error, result) {
  if (error) {
    console.warn('error: ', error);
    return process.exit(1);
  }
  try {
    console.clear();
    console.log(`${result.name} Login:\n`)
    console.log(await qrcode.generateWifiQRCode({
      ssid: result.name,
      password: result.password,
      encryption: 'WPA',
      hiddenSSID: false,
      outputFormat: { type: 'terminal' },
    }));
    return process.exit(0);
  } catch (er) {
    console.error('qr code error: ', er);
    return process.exit(1);
  }
};
/**
 * Start prompt
 */
prompt.start();
/**
 * Handle Input
 */
prompt.get(schema, handlePromptInput);
