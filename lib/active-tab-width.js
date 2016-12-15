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
    // console.log('ActiveTabWidth was toggled!');
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()X
    // );
    // let editor
    // if (editor = atom.workspace.getActiveTextEditor()) {
    //     debugger
    //     editor.setWidth( atom.window.outerWidth*0.8)
    //   }
    document.querySelectorAll('.pane').forEach(function (item) {
      var size = parseFloat(item.style.flexGrow)
      if ( item.classList.contains('active') ) {
        console.dir(item)
        item.style.flexGrow = size + size*0.8
      } else {
        item.style.flexGrow = size + size*0.2
      }
    })
  }

};
