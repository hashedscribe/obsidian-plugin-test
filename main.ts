import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from "./view";
import { SettingsTab } from "./settings";
import moment from "moment";

interface PluginSettings {
	//configurable settings
	batch_create: string;
	storage_folder: string;

	time_format: string;


	data_fields_day: string[]
	data_fields_week: string[]

	// plugin data
	creation_date: Date;
	days_covered: number;
	data_array_day: string[]
	data_array_week: string[]

}

const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	//configurable settings
	batch_create: "31",
	storage_folder: "/",
	time_format: "military",
	data_fields_day: [
		"day", //name of the day (sun, mon, tue)
		"row", //row in the spreadsheet
	],
	data_fields_week: [

	],


	// plugin data
	data_array_day: [
		"date",
		"time_blocks",
		"time_blocks_summed",
		"missing_values",
		"notes",
	],
	
	data_array_week: [
		"week_average",
		"week_total"
	]

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
		this.settings.days_covered = 0;

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
				batch_add(this.settings.batch_create, this.settings.storage_folder, this.settings.creation_date, this.settings.days_covered, this.settings.data_array_day, this.settings.data_array_week);
				let num: number = +this.settings.batch_create;
				this.settings.days_covered += num*7;
			}
		});

		//add day field
		this.addCommand({
			id: "add-day-field",
			name: "Add Data Field: Day",
			callback: () => {
				console.log("add day field")
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


/* -------------------------------------------------------------------------- */
/*                               file management                              */
/* -------------------------------------------------------------------------- */

function batch_add(x: string, path: string, creation_date: Date, days_covered: number, data_array_day: string[], data_array_week: string[]): void {
	let num: number = +x;

	for(let i = 0; i < num; i++){
		let newDate: Date = new Date(creation_date.getTime() + days_covered+(i*7) * (1000 * 60 * 60 * 24));
		this.app.vault.create(path + generate_file_name(newDate, days_covered+(i*7)) + ".md", generate_file_data(data_array_day, data_array_week, newDate)); //create the file in the first input and then the contents of the file in the second input
	}
}

function generate_file_name(date: Date, index: number): string{
	return(index.toString() + "-" + (index+6).toString() + "_" + moment(date).format("YYYY-MM-DD"));
}

function generate_file_data(data_array_day: string[], data_array_week: string[], newDate: Date): string{
	let return_string = "---\ntags:\n  - 25thHour\n"

	//writing days
	return_string = return_string + "days:\n"

	for(let i = 0; i < 7; i++){
		return_string = return_string + "- ";
		//write base info (arrays)
		for(let j = 0; j < data_array_day.length; j++){
			if(data_array_day[j] == "date"){
				//generate iso date
				return_string = return_string + data_array_day[j] + ": " + (new Date(newDate.getTime() + i *(1000 * 60 * 60 * 24))).toISOString().substring(0,10) + "\n"
			}else{
				return_string = return_string + "  " + data_array_day[j] + ": \n"
			}
		}
	}

	//writing weeks
	for(let i = 0; i < data_array_week.length; i++){
		return_string = return_string + data_array_week[i] + ": \n"
	}

	return_string = return_string + "---";
	return return_string;
}

