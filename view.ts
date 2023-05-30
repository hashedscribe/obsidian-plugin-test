import { ItemView, WorkspaceLeaf, parseYaml, TFile } from "obsidian";
import { App, PluginSettingTab, Setting } from "obsidian";
import { text_to_yaml, turn_off_box_shadow, upadteFileData } from "./main";
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
    let relevant_files: any[] = [];
    let day_objects: any[] = [];


    //filter relevant files
    for(let i = 0; i < loaded_files.length; i++){
      if("/" + loaded_files[i].parent.path + "/" == this.plugin.settings.storage_folder){
        relevant_files.push(loaded_files[i]);
      }
    }

    //sort by date
    relevant_files.sort(function(a: TFile, b: TFile):number{
      return a.name.substring(a.name.length-13, a.name.length-1).localeCompare(b.name.substring(b.name.length-13, b.name.length-1));
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
    let configure_button = nav_bar.createEl("button", {cls: "nav_button", text: "Configure"});

    grid_button.addEventListener("click", e => {
      grid_view.style.display = "block";
      configure_view.style.display = "none";

    });

    configure_button.addEventListener("click", e => {
      grid_view.style.display = "none";
      configure_view.style.display = "block";

    });


    let centre = container.createEl("div", {cls: "centre"});


    /* -------------------------------------------------------------------------- */
    /*                                activity bar                                */
    /* -------------------------------------------------------------------------- */

    let activity_bar = container.createEl("div", {cls: "activity_bar"});



    /* -------------------------------------------------------------------------- */
    /*                                making table                                */
    /* -------------------------------------------------------------------------- */

    
    let grid_view = centre.createEl("div", {cls: "grid_view"});
    let data: any[][] = []; //updated by typing in the spreadsheet
    let columns = [];

    let outer = day_objects.length;
    let inner = day_objects[0].days.length;

    for(let i = 0; i < outer; i++){
      for(let j = 0; j < inner; j++){
        let temp_array = [];
        temp_array.push(day_objects[i].days[j].date);
        for(let k = 0; k < 48; k++){
          temp_array.push(day_objects[i].days[j].time_blocks[k].activity);
        }
        data.push(temp_array);
      }
    }

    columns.push({ title: "Date", width: 120, readOnly: true});

    for(let i = 0; i < 48; i++){
      columns.push({ title: String(i+1), width: 24 });
    }


    //table functions

    let updated = function(instance: any, cell: any, x: any, y: any, value: any){
      let index: number = Math.floor(y/7);
      let full_yaml = day_objects[index];

      full_yaml.days[y%7].time_blocks[x-1].activity = value;
    
      upadteFileData(full_yaml, relevant_files[index]);
    }

    jspreadsheet(grid_view, {
      rowResize: false,
      columnResize: false,
      tableOverflow: true,
      
      data: data,
      columns: columns,

      //event handlers
      onchange: updated,
    })  
    
    
    /* -------------------------------------------------------------------------- */
    /*                              more css styling                              */
    /* -------------------------------------------------------------------------- */

    let main_container: any;
    let parent: any;
    let true_scroll = 0;

    setTimeout(() => {
      turn_off_box_shadow();

      main_container = document.getElementsByClassName("jexcel_content").item(0);
      parent = main_container.firstChild.lastChild;
      let item_list: Element[] = Array.from(parent.childNodes); 

      for(let i = item_list.length-1; i >= 0; i--){
        let e: Element = parent.childNodes.item(i);
        parent.removeChild(e);
      }   
      
      let bottom_index: number;

      for(let i = 0; i < 50; i++){
        parent.appendChild(item_list[i]);
        bottom_index = i;
      }

      let prev_scroll = 0;
  
      main_container.addEventListener("scroll", () => {
        let top_index = Math.floor(main_container.scrollTop/20); 
        let buffer = 2;

        console.log(top_index);
        true_scroll = true_scroll + (main_container.scrollTop - prev_scroll);

        if(prev_scroll < true_scroll){
          for(let i = 0; i < buffer; i++){
            parent.appendChild(item_list[bottom_index + i]);
          }
          
          bottom_index = bottom_index + buffer - 1; //recalculate 
        }else if (prev_scroll > top_index){
          // console.log("scrolling up");
          //could clip list and then set 
  
        }

        prev_scroll = main_container.scrollTop;

        })
    }, 0);


  



    /* -------------------------------------------------------------------------- */
    /*                                  configure                                 */
    /* -------------------------------------------------------------------------- */
    let configure_view = centre.createEl("div", {cls: "configure_view", text: "Configure settings here"});




    /* -------------------------------------------------------------------------- */
    /*                                 stats view                                 */
    /* -------------------------------------------------------------------------- */
    let stats_view = centre.createEl("div", {cls: "stats_view", text: "Look at statistics here"});



  }

  async onClose() {
    // Nothing to clean up.
  }
}