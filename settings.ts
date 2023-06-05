import ExamplePlugin from "./main";
import Activity from "./main";
import { make_activity, make_field } from "./main";
import { App, ButtonComponent, ColorComponent, PluginSettingTab, Setting, TextComponent } from "obsidian";

export class SettingsTab extends PluginSettingTab {
    plugin: ExamplePlugin;

    constructor(app: App, plugin: ExamplePlugin) {
      super(app, plugin);
      this.plugin = plugin;
    }

    display(): void{
        let { containerEl } = this;

        containerEl.empty();

        let main_settings_view = containerEl.createEl("div");
        let activity_settings_view = containerEl.createEl("div");
        
        display_main_page(main_settings_view, this.plugin.settings, this.plugin, main_settings_view);


        console.log(containerEl);
    }
}



/* -------------------------------------------------------------------------- */
/*                                  main view                                 */
/* -------------------------------------------------------------------------- */

function display_main_page(containerEl: any, settings: any, plugin: any, main_container: any){
    new Setting(containerEl)
    .setName("Batch add number")
    .setDesc("Number of files each batch add should create.")
    .addText((text) => 
        text
        .setPlaceholder("31")
        .setValue(settings.batch_create)
        .onChange(async (value) => {
            settings.batch_create = value;
            await plugin.saveSettings();
        })
    )

    new Setting(containerEl)
    .setName("Folder")
    .setDesc("Folder that will store all the day data")
    .addText((text) => 
        text
        .setPlaceholder("Example: /home/data files")
        .setValue(settings.storage_folder)
        .onChange(async (value) => {
            settings.storage_folder = value;
            await plugin.saveSettings();
        })
    )

    new Setting(containerEl)
    .setName("Days covered: ")
    .setDesc(settings.days_covered.toString())


    let activities = containerEl.createEl("div");
    let fields = containerEl.createEl("div");


    new Setting(activities)
    .setHeading()
    .setName("Activities")
    .addButton((component: ButtonComponent) => {
        component.setButtonText("+ Activity");
        component.onClick(e => {
            make_activity(settings);
            display_settings(settings.activity_list[settings.activity_list.length-1], activities, settings, main_container)
        })
    })

    let activityLoop = settings.activity_list.length;

    for(let i = 0; i < activityLoop ; i++){
        display_settings(settings.activity_list[i], activities, settings, main_container)
    } 
    
    new Setting(containerEl)
        .setHeading()
        .setName("Fields")
        .addButton((component: ButtonComponent) => {
            component.setButtonText("+ Field");
            component.onClick(e => {
                make_field();
            })
        })
}

/* -------------------------------------------------------------------------- */
/*                            display under in main                           */
/* -------------------------------------------------------------------------- */

function display_settings(item: any, containerEl: any, settings: any, main_container: any){
    new Setting(containerEl)
    .setName("Name")
    .addButton((component: ButtonComponent) => {
        component.setButtonText("Edit");
        component.onClick(e => {
            edit_activity(item, settings, main_container);
        })
    })
}


/* -------------------------------------------------------------------------- */
/*                             edit activity view                             */
/* -------------------------------------------------------------------------- */

function edit_activity(item: any, settings: any, main_container: any){
    console.log("testing jksfhg")
    console.log(main_container)
    main_container.style.visibility = "hidden";
}