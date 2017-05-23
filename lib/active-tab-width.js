'use babel';

import ActiveTabWidthView from './active-tab-width-view';
import { CompositeDisposable } from 'atom';

export default {

  activeTabWidthView: null,
  modalPanel: null,
  subscriptions: null,
  config: {
    'active tab width': {
      type: 'integer',
       description: 'percentage value (%) min 70, max 100',
      default: 90
    }
  },

  activate(state) {
    this.activeTabWidthView = new ActiveTabWidthView(state.activeTabWidthViewState);
    this.subscription = atom.workspace.onDidChange
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.activeTabWidthView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    // this.subscribedOnActive = w.onDidChangeActivePane(function () {console.log(arguments)})

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'active-tab-width:toggle': () => this.toggle(),
      'active-tab-width:reset': () => this.resetAll(),
      'active-tab-width:toggleAuto': () => this.toggleSubscription()
    }));
  },

  toggleSubscription () {
    console.log(' ==> toggleSubscription')
    if (this.onDidChangeActive ) {
      this.unsubscribedOnActive();
    } else {
      this.subscribedOnActive();
    }
  },
  subscribedOnActive () {
    const self = this
    const paneContainer = atom.workspace.getPaneContainers()
    .filter(item => item.constructor.name === 'WorkspaceCenter')[0] || null
    this.onDidChangeActive = paneContainer.onDidChangeActivePane(function () { self.toggle() })
    atom.notifications.addSuccess('Auto width on active tab is activated')
  },
  unsubscribedOnActive () {
    this.onDidChangeActive.dispose()
    this.onDidChangeActive = null
    atom.notifications.addWarning('Auto width on active tab is disabled')
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.activeTabWidthView.destroy();
  },

  serialize() {
    return {
      activeTabWidthViewState: this.activeTabWidthView.serialize()
    };
  },

  calculate (numOfPanes, fullWidth, activeWidth) {
    let theValue  = atom.config.get('active-tab-width.active tab width') || 90
    theValue = (theValue < 70 || theValue > 100) ? 90 : theValue
    const wwp = fullWidth * (theValue/100)
    let value = activeWidth
    if (activeWidth < wwp) value = (fullWidth/activeWidth)
    return value
  },

  toggle() {
    this.resetAll()
    const fullWidth = atom.workspace.element.offsetWidth;
    const paneContainer = atom.workspace.getPaneContainers().filter(item => item.constructor.name === 'WorkspaceCenter')[0] || null;
    const allPanes = paneContainer && paneContainer.getPanes() || [];
    if (allPanes.length < 2) return
    allPanes.map((item) => {
      if(item.element.classList.contains('active')) console.log(item)
      const flexValue = item.focused
      ? this.calculate(allPanes.length, fullWidth, item.element.offsetWidth)
      : 1
      item.setFlexScale(flexValue)
    })
  },

  resetAll () {
    const fullWidth = atom.workspace.element.offsetWidth;
    const paneContainer = atom.workspace.getPaneContainers().filter(item => item.constructor.name === 'WorkspaceCenter')[0] || null
    paneContainer && paneContainer
    .getPanes()
    .map((item) => item.setFlexScale(1))
  }

};
