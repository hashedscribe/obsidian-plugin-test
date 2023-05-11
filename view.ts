import { ItemView, WorkspaceLeaf, parseYaml, TFile } from "obsidian";
import { App, PluginSettingTab, Setting } from "obsidian";
import { text_to_yaml, turn_off_box_shadow } from "./main";
import jspreadsheet from "jspreadsheet-ce";
import ExamplePlugin from "./main";

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
    <link rel="stylesheet" href="https://jsuites.net/v4/jsuites.css" type="text/css" />`;

    container.innerHTML = container.innerHTML + insertHtml;



    /* -------------------------------------------------------------------------- */
    /*                               making nav bar                               */
    /* -------------------------------------------------------------------------- */

    let nav_bar = container.createEl("div", {cls: "nav_bar"});
    let grid_button = nav_bar.createEl("button", {cls:"nav_button", text: "Grid"});
    let stats_button = nav_bar.createEl("button", {cls: "nav_button", text: "Stats"});
    let configure_button = nav_bar.createEl("button", {cls: "nav_button", text: "Configure"});


    grid_button.addEventListener("click", e => {
      grid_view.style.display = "block";
      configure_view.style.display = "none";
      stats_view.style.display = "none";

    });

    stats_button.addEventListener("click", e => {
      grid_view.style.display = "none";
      configure_view.style.display = "none";
      stats_view.style.display = "block";

    });

    configure_button.addEventListener("click", e => {
      grid_view.style.display = "none";
      configure_view.style.display = "block";
      stats_view.style.display = "none";

    });


    let centre = container.createEl("div", {cls: "centre"});

    /* -------------------------------------------------------------------------- */
    /*                                making table                                */
    /* -------------------------------------------------------------------------- */

    
    let grid_view = centre.createEl("div", {cls: "grid_view"});
    let data = [];
    let columns = [];

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

    columns.push({ title: "Date", width: 120 });

    for(let i = 0; i < 48; i++){
      columns.push({ title: String(i+1), width: 24 });
    }

    jspreadsheet(grid_view, {
      rowResize: false,
      columnResize: false,
      tableOverflow: true,
      tableHeight: "1000px",
      
      data: data,
      columns: columns,
    })    

    /* -------------------------------------------------------------------------- */
    /*                                  configure                                 */
    /* -------------------------------------------------------------------------- */
    let configure_view = centre.createEl("div", {cls: "configure_view", text: "Configure settings here"});




    /* -------------------------------------------------------------------------- */
    /*                                 stats view                                 */
    /* -------------------------------------------------------------------------- */
    let stats_view = centre.createEl("div", {cls: "stats_view", text: "Look at statistics here"});




    /* -------------------------------------------------------------------------- */
    /*                              more css styling                              */
    /* -------------------------------------------------------------------------- */
    setTimeout(() => {
      turn_off_box_shadow()
    }, 0);
  
  }

  async onClose() {
    // Nothing to clean up.
  }
}