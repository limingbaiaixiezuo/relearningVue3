import {createI18n} from 'vue-i18n';

function getMessage() {
  const jsons = import.meta.glob('./lang/*.json', { eager: true });
  const message = {};
  for (const key in jsons) {
    const messageKey = key.replace(/\.\/lang\/(.+)\.json/, (match, p1) => p1);
    message[messageKey] = jsons[key].default;
  }
  return message;
}
const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages: getMessage()
});
export default i18n;

