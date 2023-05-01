import ExamplePlugin from "./main";
import { ItemView, WorkspaceLeaf, parseYaml, TFile } from "obsidian";
import { App, PluginSettingTab, Setting } from "obsidian";
import { text_to_yaml } from "./main";

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
    container.createEl("div", { text: "Test" });


    let loaded_files = this.app.vault.getMarkdownFiles();
    let relevant_files = [];
    let day_objects = [];
    
    // console.log(loaded_files);
    console.log(this.plugin.settings);

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

    display_files(relevant_files, container);

    //pull yaml to objects
    for(let i = 0; i < relevant_files.length; i++){
      day_objects.push(await text_to_yaml(relevant_files[i]));
    }

    console.log(day_objects);



    /* -------------------------------------------------------------------------- */
    /*                                making table                                */
    /* -------------------------------------------------------------------------- */




    



  }

  async onClose() {
    // Nothing to clean up.
  }
}

async function display_files(files: TFile[], parent_container: any){
  for(let i = 0; i < files.length; i++){
    parent_container.createEl("div", { text: files[i].name });
    // console.log(text_to_yaml(files[i]));
  }
}