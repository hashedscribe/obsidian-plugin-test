import ExamplePlugin from "main";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { App, PluginSettingTab, Setting } from "obsidian";

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView {
  plugin: ExamplePlugin;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return "25th Hour";
  }

  async onOpen() {
    //container is an html element
    const container = this.containerEl.children[1];
    console.log(container);
    container.empty();
    container.createEl("div", { text: "Test" });

    let files = this.app.vault.getMarkdownFiles();

    console.log(files);
    console.log(this);

    for(let i = 0; i < files.length; i++){
      if(files[i].path == this.plugin.settings.storage_folder){
        container.createEl("div", {text: files[i].path});
      }
    }
  }

  async onClose() {
    // Nothing to clean up.
  }
}