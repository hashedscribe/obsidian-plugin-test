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
    container.createEl("h1", { text: "Test" });
  }

  async onClose() {
    // Nothing to clean up.
  }
}