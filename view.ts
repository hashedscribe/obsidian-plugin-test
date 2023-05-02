import ExamplePlugin from "./main";
import { ItemView, WorkspaceLeaf, parseYaml, TFile } from "obsidian";
import { App, PluginSettingTab, Setting } from "obsidian";
import { text_to_yaml } from "./main";
import jspreadsheet from "jspreadsheet-ce";

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView {
  plugin: ExamplePlugin;

  constructor(leaf: WorkspaceLeaf, plugin: ExamplePlugin) {
    super(leaf);
    this.plugin = plugin; 
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() { //top of file/tab
    return "25th Hour";
  }

  async onOpen() {
    //container is an html element
    const container = this.containerEl.children[1];
    console.log(container);
    container.empty();

    let loaded_files = this.app.vault.getMarkdownFiles();
    let relevant_files = [];
    let day_objects = [];


    //filter relevant files
    for(let i = 0; i < loaded_files.length; i++){
      if("/" + loaded_files[i].parent.path + "/" == this.plugin.settings.storage_folder){
        relevant_files.push(loaded_files[i])
      }
    }
    //sort by date
    relevant_files.sort(function(a: TFile, b: TFile):number{
      return a.name.substring(a.name.length-13, a.name.length-1).localeCompare(b.name.substring(b.name.length-13, b.name.length-1))
    })

    //pull yaml to objects
    for(let i = 0; i < relevant_files.length; i++){
      day_objects.push(await text_to_yaml(relevant_files[i]));
    }


    /* -------------------------------------------------------------------------- */
    /*                   insert jexcel/jspreadsheet and jsuites                   */
    /* -------------------------------------------------------------------------- */

    let insertHtml = `<script src="https://bossanova.uk/jspreadsheet/v4/jexcel.js"></script>
    <script src="https://jsuites.net/v4/jsuites.js"></script>
    <link rel="stylesheet" href="https://jsuites.net/v4/jsuites.css" type="text/css" />
    <link rel="stylesheet" href="https://bossanova.uk/jspreadsheet/v4/jexcel.css" type="text/css" />`;

    container.innerHTML = container.innerHTML + insertHtml;

    /* -------------------------------------------------------------------------- */
    /*                               making nav bar                               */
    /* -------------------------------------------------------------------------- */

    let nav_bar = container.createEl("div", {cls: "nav_bar"});




    /* -------------------------------------------------------------------------- */
    /*                                making table                                */
    /* -------------------------------------------------------------------------- */

    let main_grid = container.createEl("div", {cls: "main_grid"});
    let data = [];

    for(let i = 0; i < day_objects.length; i++){
      for(let j = 0; j < day_objects[i].days.length; j++){
        let temp_array = [];
        temp_array.push(day_objects[i].days[j].date);
        for(let k = 0; k < 48; k++){
          temp_array.push(day_objects[i].days[j].time_blocks[k].activity)
        }
        data.push(temp_array);
      }
    }



    jspreadsheet(main_grid, {
      lazyLoading: true,
      rowResize: false,
      columnResize: false,
      tableOverflow: true,
      tableHeight: "100%",
      data: data,
      columns: [
        { title: "Date", width: 120 },
      ]
    })
  }

  async onClose() {
    // Nothing to clean up.
  }
}