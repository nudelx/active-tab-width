'use babel';

import ActiveTabWidthView from './active-tab-width-view';
import { CompositeDisposable } from 'atom';

export default {

  activeTabWidthView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.activeTabWidthView = new ActiveTabWidthView(state.activeTabWidthViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.activeTabWidthView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'active-tab-width:toggle': () => this.toggle()
    }));
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

  toggle() {
    console.log('ActiveTabWidth was toggled!');
    const fullWidth = atom.workspace.element.offsetWidth;
    const paneContainer = atom.workspace.getPaneContainers().filter(item => item.constructor.name === 'WorkspaceCenter')[0] || null
    paneContainer && paneContainer
    .getPanes()
    .map((item) => {
      const flexValue = item.element.classList.contains('active')) ? 1 : 11
      item.setFlexScale(flexValue)
    })
    // const activeEditor = atom.workspace.getActiveTextEditor();
    // const openEditors =  atom.workspace
    // .getPaneItems()
    // .filter(p => p.constructor.name === 'TextEditor' && activeEditor.id !== p.id)
  }

  resetAll () {
    const fullWidth = atom.workspace.element.offsetWidth;
    const paneContainer = atom.workspace.getPaneContainers().filter(item => item.constructor.name === 'WorkspaceCenter')[0] || null
    paneContainer && paneContainer
    .getPanes()
    .map((item) => item.setFlexScale(1))
  }

};
