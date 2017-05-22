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
    const activeEditor = atom.workspace.getActiveTextEditor()
    const openTabs =  atom.workspace
    .getPaneItems()
    .filter(p => p.constructor.name === 'TextEditor' && activeEditor.id !== p.id)

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
    let editor = atom.workspace.getActiveTextEditor()
    debugger
    // let constWith = 800
    // editor.getWidth()
    // console.log('test')
    // debugger
  //   document.querySelectorAll('.pane').forEach(function (item) {
  //     if ( item.classList.contains('active') ) {
  //       console.log('pane: ', item.clientWidth);
  //       console.log('client: ', item.parentElement.clientWidth);
  //       console.log('Flex: ', item.style.flexGrow)
  //       const fl = parseFloat( (item.style.flexGrow * (item.parentElement.clientWidth / item.clientWidth) ) ).toFixed(3)
  //       console.log('value: ', fl )
  //       console.log('curent: ', item.style.flexGrow);
  //       item.style.flexGrow = (fl+parseFloat(item.style.flexGrow)); console.log('curentUpdated: ', item.style.flexGrow);
  //
  //     }
  // });
  }

};
