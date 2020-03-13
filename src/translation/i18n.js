import { app } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'

class I18n {
  constructor () {
    app.on('ready', () => {
      this.fileName = join(__dirname, app.getLocale() + '.json')
      if (!existsSync(this.fileName)) {
        this.fileName = join(__dirname, 'en.json')
      }
      this.loadedLanguage = JSON.parse(readFileSync(this.fileName), 'utf8')
    })
  }
  __ (phrase) {
    return this.loadedLanguage[phrase] || phrase
  }
}

export var i18n = new I18n()
