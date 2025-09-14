export class Install  {
  /**
  * @param {DOMElement} trigger - Triggering element
  */
  constructor(trigger) {
    this._prompt;
    this._trigger = trigger;

    window.addEventListener('beforeinstallprompt', (evt) => {
      evt.preventDefault();
      this._prompt = evt;
      this.toggleInstallButton('show')
    })

    this._trigger.addEventListener('click', this.triggerInstall.bind(this));

    window.addEventListener('appinstalled', () => {
      this._prompt = null;
      this.toggleInstallButton('hide')
    })
  }

  toggleInstallButton(action='hide'){
    if (action === 'hide') {
      this._trigger.style.display = 'none';
    } else {
      this._trigger.style.display = 'block';
    }
  }

  async triggerInstall(){
    this._prompt.prompt()
    const {outcome} = await this._prompt.userChoice

    this._prompt = null

    if (outcome === 'accepted') {
      this.toggleInstallButton('hide')
    }
  }
}
