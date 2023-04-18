import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./view";
import { SettingsTab } from "./settings";

interface PluginSettings {
	batchAdd: string;
}

const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	batchAdd: "31",
}

export default class ExamplePlugin extends Plugin {

	settings: PluginSettings;

	async onload() { //add commands here as well


		/* -------------------------------------------------------------------------- */
		/*                                  settings                                  */
		/* -------------------------------------------------------------------------- */

		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this)); 



		/* -------------------------------------------------------------------------- */
		/*                                  page view                                 */
		/* -------------------------------------------------------------------------- */

		// register view (enable it to load)
		this.registerView(
			VIEW_TYPE_EXAMPLE,
			(leaf) => new ExampleView(leaf)
		);


		// open view from ribbon icon
		this.addRibbonIcon("dice", "Activate view", () => {
			this.activateView();
		});


		/* -------------------------------------------------------------------------- */
		/*                               file management                              */
		/* -------------------------------------------------------------------------- */

		//batch add
		this.addCommand({
			id: "add-month",
			name: "Batch add files",
			callback: () => {
				// batch_add();
				// console.log(this.settings.batchAdd);
				// console.log("test")
			}
		});







	}

	async onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);
	}


	/* -------------------------------------------------------------------------- */
	/*                                  settings                                  */
	/* -------------------------------------------------------------------------- */

	async loadSettings(){
		this.loadSettings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(){
		await this.saveData(this.settings);
	}

	/* -------------------------------------------------------------------------- */
	/*                                  page view                                 */
	/* -------------------------------------------------------------------------- */
	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);

		await this.app.workspace.getLeaf(true).setViewState({
			type: VIEW_TYPE_EXAMPLE,
			active: true,
		});

		//   this.app.workspace.revealLeaf(
		// 	this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0]
		//   );
	}
}


function batch_add(x: string): void {
	console.log("batch of" + x +  "added");
}