'use babel';

import ActiveTabWidthView from './active-tab-width-view';
import { CompositeDisposable } from 'atom';

export default {

  activeTabWidthView: null,
  modalPanel: null,
  subscriptions: null,
  flexCache: {},
  paneContainer: null,
  config: {
    'active tab width': {
      type: 'integer',
       description: 'percentage value (%) min 70, max 100',
      default: 90
    }
  },


  activate(state) {
    const self = this
    this.activeTabWidthView = new ActiveTabWidthView(state.activeTabWidthViewState);
    this.subscription = atom.workspace.onDidChange
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.activeTabWidthView.getElement(),
      visible: false
    });
    this.paneContainer = atom.workspace.getPaneContainers()
      .filter(item => item.constructor.name === 'WorkspaceCenter')[0] || null

      // remove pane subscription on destroy
    this.paneContainer.onWillDestroyPane(function ({ pane }) {
      if (self.flexCache[pane.id]) {
        const sod = self.flexCache[pane.id];
        sod.subscription.dispose();
        delete self.flexCache[pane.id];
      }
    })

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
    this.onDidChangeActive = this.paneContainer.onDidChangeActivePane(function () { self.toggle() })
    atom.notifications.addSuccess('Auto width on active tab is activated')
  },

  unsubscribedOnActive () {
    this.onDidChangeActive.dispose()
    this.onDidChangeActive = null
    atom.notifications.addWarning('Auto width on active tab is disabled')
  },

  deactivate () {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.activeTabWidthView.destroy();
  },

  serialize () {
    return {
      activeTabWidthViewState: this.activeTabWidthView.serialize()
    };
  },

  calculate (numOfPanes, atomWidth, pane) {
    const currentFlexValue = pane.getFlexScale();
    const currentPaneWidth = pane.element.offsetWidth;
    const cachedFlexValue  = this.flexCache[pane.id] || 0
    let confValue  = atom.config.get('active-tab-width.active tab width') || 90
    let finalFlexValue = currentFlexValue

    confValue = (confValue < 70 || confValue > 100) ? 90 : confValue
    let wantedPaneWidth = atomWidth * (confValue/100)

    if (currentPaneWidth < wantedPaneWidth) finalFlexValue = (atomWidth/currentPaneWidth)
    finalFlexValue = (finalFlexValue < cachedFlexValue) ? cachedFlexValue : finalFlexValue
    return finalFlexValue
  },

  toggle () {
    const self  = this
    this.resetAll()
    const atomWidth = atom.workspace.element.offsetWidth;
    const allPanes = this.paneContainer && this.paneContainer.getPanes() || [];
    if (allPanes.length < 2) return
    // cosnt focusedPane = allPanes.filter(pane => pane.focused)
    allPanes.map((item) => {
      if (item.element.classList.contains('active')) console.log(item)

      const flexValue = item.focused
      ? this.calculate(allPanes.length, atomWidth, item)
      : 0.5
      item.setFlexScale(flexValue)
    })
  },

  resetAll () {
    const self  = this;
    this.paneContainer && this.paneContainer
    .getPanes()
    .map((item) => {
      // console.log(`${item.id} ==>`, item.getFlexScale())
      // const f = item.getFlexScale()
      // const current = self.flexCache[item.id] || 0
      // self.flexCache[item.id] = (f > current) ? f : current;
      item.setFlexScale(1);
    })
  }

};
