import ExamplePlugin from "./main";
import Activity from "./main";
import { make_activity, make_field } from "./main";
import { App, ButtonComponent, ColorComponent, EditableFileView, PluginSettingTab, Setting, SettingTab, TextComponent } from "obsidian";


let main_settings_view: HTMLDivElement, activity_settings_view: HTMLDivElement;

export class SettingsTab extends PluginSettingTab {
    plugin: ExamplePlugin;

    constructor(app: App, plugin: ExamplePlugin) {
      super(app, plugin);
      this.plugin = plugin;
    }

 

    display(): void{
        let { containerEl } = this;

        main_settings_view = containerEl.createEl("div");
        activity_settings_view = containerEl.createEl("div");
        
        display_main_page(this.plugin.settings, this.plugin);
    }
}


/* -------------------------------------------------------------------------- */
/*                                  main view                                 */
/* -------------------------------------------------------------------------- */

function display_main_page(settings: any, plugin: any){

    main_settings_view.empty();
    activity_settings_view.empty();

    new Setting(main_settings_view)
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

    new Setting(main_settings_view)
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

    new Setting(main_settings_view)
    .setName("Days covered: ")
    .setDesc(settings.days_covered.toString())


    let activities = main_settings_view.createEl("div");
    let fields = main_settings_view.createEl("div");


    new Setting(activities)
    .setHeading()
    .setName("Activities")
    .addButton((component: ButtonComponent) => {
        component.setButtonText("+ Activity");
        component.onClick(e => {
            make_activity(settings);
            display_settings(settings.activity_list[settings.activity_list.length-1], activities, settings, plugin)
        })
    })

    let activityLoop = settings.activity_list.length;

    for(let i = 0; i < activityLoop ; i++){
        display_settings(settings.activity_list[i], activities, settings, plugin)
    } 
    
    // new Setting(main_settings_view)
    //     .setHeading()
    //     .setName("Fields")
    //     .addButton((component: ButtonComponent) => {
    //         component.setButtonText("+ Field");
    //         component.onClick(e => {
    //             make_field();
    //         })
    //     })
}


/* -------------------------------------------------------------------------- */
/*                            display under in main                           */
/* -------------------------------------------------------------------------- */

function display_settings(item: any, containerEl: any, settings: any, plugin: any){
    new Setting(containerEl)
    .setName(item.activity_name)
    .addButton((component: ButtonComponent) => {
        component.setButtonText("Edit");
        component.onClick(e => {
            main_settings_view.empty();
            activity_settings_view.empty();

            let return_to_main = activity_settings_view.createEl("button", {text: "<"});

            return_to_main.addEventListener("click", e => {
                display_main_page(settings, plugin)
            })


            /* -------------------------------- settings -------------------------------- */

            new Setting(activity_settings_view)
            .setName("Name")
            .addText((text) => 
                text
                .setValue(item.activity_name)
                .onChange(async (value) => {
                    settings.activity_list[settings.activity_list.indexOf(item)].activity_name = value;
                    await plugin.saveSettings();
                })
            )

            new Setting(activity_settings_view)
            .setName("Colour")
            .addColorPicker((component: ColorComponent) => {
                component.setValue(item.colour_hex)
                component.onChange(async (value) => {
                    settings.activity_list[settings.activity_list.indexOf(item)].colour_hex = value;
                    await plugin.saveSettings();
                })
            })

            new Setting(activity_settings_view)
            .setName("Grid Identifier")
            .addText((text) => 
                text
                .setValue(item.key)
                .onChange(async (value) => {
                    settings.activity_list[settings.activity_list.indexOf(item)].key = value;
                    await plugin.saveSettings();
                })
            )

            

        })
    })
}