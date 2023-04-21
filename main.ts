import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./view";
import { SettingsTab } from "./settings";
import moment from "moment";

interface PluginSettings {
	batch_create: string;
	storage_folder: string;
	creation_date: Date;
	days_covered: number;
}

const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	batch_create: "31",
	storage_folder: "/",
	days_covered: 0,
}

export default class ExamplePlugin extends Plugin {
	settings: PluginSettings;

	async onload() { //add commands here as well
		/* -------------------------------------------------------------------------- */
		/*                                  settings                                  */
		/* -------------------------------------------------------------------------- */

		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this)); 
		this.settings.creation_date = new Date();

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
				batch_add(this.settings.batch_create, this.settings.storage_folder, this.settings.creation_date, this.settings.days_covered);
			}
		});

		console.log(this.app);
		console.log(this.settings.creation_date);
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


function batch_add(x: string, path: string, creation_date: Date, days_covered: number): void {
	
	console.log("batch of " + x +  " files added");
	console.log(path);

	let num: number = +x;

	console.log(num);

	for(let i = 0; i < num; i++){
		let newDate: Date = new Date(creation_date.getTime() + days_covered+(i*7) * (1000 * 60 * 60 * 24));
		this.app.vault.create(path + generate_file_name(newDate, days_covered+(i*7)) + ".md", ""); //create the file in the first input and then the contents of the file in the second input
	}
}


function generate_file_name(date: Date, index: number): string{
	return(index.toString() + "-" + (index+6).toString() + "_" + moment(date).format("YYYY-MM-DD"));
}

function generate_file_data(): string{



	return "";
}