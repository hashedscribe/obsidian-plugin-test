import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./view";

export default class ExamplePlugin extends Plugin {
	async onload() {
	  this.registerView(
		VIEW_TYPE_EXAMPLE,
		(leaf) => new ExampleView(leaf)
	  );
  
	  this.addRibbonIcon("dice", "Activate view", () => {
		this.activateView();
	  });
	}
  
	async onunload() {
	  this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);
	}
  
	async activateView() {
	  this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);
  
	  await this.app.workspace.getRightLeaf(false).setViewState({
		type: VIEW_TYPE_EXAMPLE,
		active: true,
	  });
  
	  this.app.workspace.revealLeaf(
		this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0]
	  );
	}
}