import { default as params } from '@params'
import Translator from "js/i18n/translator"

const i18n = new Translator(params.i18n, params.defaultLang)

export default i18n
