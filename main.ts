import { App, Notice, Plugin, PluginSettingTab, Setting, parseYaml } from 'obsidian';
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

	activity_list: string[]


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

	// plugin data
}

export default class ExamplePlugin extends Plugin {
	settings: PluginSettings;

	async onload() { //add commands here as well
		/* -------------------------------------------------------------------------- */
		/*                                  settings                                  */
		/* -------------------------------------------------------------------------- */

		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this)); 

		//ensuring settings are correct

		this.settings.creation_date = new Date();
		this.settings.days_covered = 0;
		this.settings.data_fields_day = [];

		this.settings.data_array_day = [
			"row",
			"date",
			"time_blocks",
			"time_blocks_summed",
		];
		
		this.settings.data_array_week = [
			"week_average",
			"week_total"
		];
		

		/* -------------------------------------------------------------------------- */
		/*                                  page view                                 */
		/* -------------------------------------------------------------------------- */

		// register view (enable it to load)
		this.registerView(
			VIEW_TYPE_EXAMPLE,
			(leaf) => new ExampleView(leaf, this)
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
				batch_add(this.settings.batch_create, this.settings.storage_folder, this.settings.creation_date, this.settings.days_covered, this.settings.data_array_day, this.settings.data_array_week, this.settings.data_fields_day, this.settings.data_fields_week);
				let num: number = +this.settings.batch_create;
				this.settings.days_covered += num*7;	
			}
		});

		this.addCommand({
			id: "update-files",
			name: "Update file data",
			callback: () => {
				
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

async function batch_add(x: string, path: string, creation_date: Date, days_covered: number, data_array_day: string[], data_array_week: string[], data_fields_day: string[], data_fields_week: string[]) {
	let num: number = +x;

	console.log(days_covered)

	for(let i = 0; i < num; i++){
		let newDate: any = moment(new Date(creation_date.getTime() + (days_covered+7*i)* (1000 * 60 * 60 * 24)+i)).format("YYYY-MM-DD");
		console.log(newDate)
		let new_path: string = path + generate_file_name(newDate, (days_covered+(i*7))) + ".md";
		await this.app.vault.create(new_path, generate_file_data(data_array_day, data_array_week, data_fields_day, data_fields_week, days_covered+(i*7), creation_date, new_path)); //create the file in the first input and then the contents of the file in the second input
	}
	let files: any = get_files(this.app.vault.getAbstractFileByPath("/"), path);
}

function generate_file_name(date: Date, index: number): string{
	return(index.toString() + "-" + (index+6).toString() + "_" + moment(date).format("YYYY-MM-DD"));
}

function generate_file_data(data_array_day: string[], data_array_week: string[], data_fields_day: string[], data_fields_week: string[],  index: number, creation_date: Date, parent_file_path: string): string{
	let return_string = "---\ntags:\n  - 25thHour\n"

	//writing days
	return_string = yaml_append(return_string, "days", 0, false);

	for(let i = 0; i < 7; i++){
		//setting up empty file
		// return_string = yaml_append(return_string, data_array_day[0], 2, true);
		return_string = return_string + "  - row: " + (index+i).toString() + "\n";
		return_string = return_string + "    date: " + moment(new Date(creation_date.getTime() + (index + i)* (1000 * 60 * 60 * 24)+i)).format("YYYY-MM-DD") + "\n";

		// return_string = yaml_append(return_string, data_array_day[1], 4, false);
		return_string = yaml_append(return_string, data_array_day[2], 4, false);

		for(let k = 0; k < 48; k++){
			return_string = yaml_append(return_string, k.toString(), 6, true);
			return_string = yaml_append(return_string, "time", 8, false);
			return_string = yaml_append(return_string, "activity", 8, false);
			return_string = yaml_append(return_string, "notes", 8, false);
		}
		return_string = yaml_append(return_string, data_array_day[3], 4, false);

		for(let i = 0; i < data_fields_day.length; i++){
			return_string = yaml_append(return_string, data_fields_day[i], 4, false);
		}

		return_string = return_string + "    parent_file: " + parent_file_path + "\n";
	}

	//writing weeks
	for(let i = 0; i < data_array_week.length; i++){
		return_string = yaml_append(return_string, data_array_week[i], 0, false);
	}

	for(let i = 0; i < data_fields_week.length; i++){
		return_string = yaml_append(return_string, data_fields_week[i], 0, false);
	}

	return_string = return_string + "---";
	return return_string;
}

function yaml_append(original_string: string, new_value: string, indent: number, array_item: boolean): string{
	let return_string = "";

	//write indents
	for(let i = 0; i < indent; i++){
		return_string += " ";
	}

	//add a dash
	if(array_item){
		return_string += "- ";
	}

	return_string += new_value + ":\n";
	return (original_string + return_string);
}

function get_files(all_files: any, storage_folder: string){
	let files;
	for(let i = 0; i < all_files.children.length; i++){
		if("/" + (all_files.children[i].path) + "/" == storage_folder){
			files = all_files.children[i].children;
			break;
		}
	}
	return(files.slice(0, files.length));
}

export async function text_to_yaml(file: any): Promise<any>{
	let file_contents = await this.app.vault.read(file);
    let file_obj = parseYaml(file_contents.substring(3, file_contents.length-3));
	return file_obj;
}


/* -------------------------------------------------------------------------- */
/*                                update values                               */
/* -------------------------------------------------------------------------- */





/* -------------------------------------------------------------------------- */
/*                               style setttings                              */
/* -------------------------------------------------------------------------- */

export function turn_off_box_shadow(){
    let grid: any = document.getElementsByClassName("jexcel_content")[0];
	grid.style.boxShadow = "none";
}