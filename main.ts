import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./view";
import { SettingsTab } from "./settings";
import plugin_config_data from  "./plugin_config_data.json"

interface PluginSettings {
	batch_create: string;
	storage_folder: string;
}

const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	batch_create: "31",
	storage_folder: "/"
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
				batch_add(this.settings.batch_create, this.settings.storage_folder);
			}
		});

		console.log(this.app);
		console.log(plugin_config_data);

	}

	async onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);
	}


	/* -------------------------------------------------------------------------- */
	/*                                  settings                                  */
	/* -------------------------------------------------------------------------- */

	async loadSettings(){
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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
	}
}


function batch_add(x: string, path: string): void {
	
	console.log("batch of " + x +  " files added");
	console.log(path);
	let num: number = +x;

	for(let i = 0; i < num; i++){
		this.app.vault.create(path+"data_" + i + ".md", ""); //create the file in the first input and then the contents of the file in the second input
	}
}

function generate_file_name(date: Date, ): string{

	return "";
}

function generate_file_data(): string{

	return "";
}