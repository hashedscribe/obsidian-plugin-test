import ExamplePlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { toggle_numbers } from "./main";

export class SettingsTab extends PluginSettingTab {
    plugin: ExamplePlugin;

    constructor(app: App, plugin: ExamplePlugin) {
      super(app, plugin);
      this.plugin = plugin;
    }

    display(): void{
        let { containerEl } = this;

        containerEl.empty();

        console.log(this.plugin);

        new Setting(containerEl)
            .setName("Batch add number")
            .setDesc("Number of files each batch add should create.")
            .addText((text) => 
                text
                .setPlaceholder("31")
                .setValue(this.plugin.settings.batch_create)
                .onChange(async (value) => {
                    this.plugin.settings.batch_create = value;
                    await this.plugin.saveSettings();
                })
            )

        new Setting(containerEl)
        .setName("Folder")
        .setDesc("Folder that will store all the day data")
        .addText((text) => 
            text
            .setPlaceholder("Example: /home/data files")
            .setValue(this.plugin.settings.storage_folder)
            .onChange(async (value) => {
                this.plugin.settings.storage_folder = value;
                await this.plugin.saveSettings();
            })
        )
        
        new Setting(containerEl)
        .setName("Days covered: ")
        .setDesc(this.plugin.settings.days_covered.toString())


        new Setting(containerEl)
        .setName("Show numbers")
        .setDesc("Toggles showing the number on the left hand side.")
        .addToggle((text) => 
            text
            .setValue(this.plugin.settings.show_numbers)
            .onChange(async (value) => {
                this.plugin.settings.show_numbers = value;
                toggle_numbers(value);
                await this.plugin.saveSettings();
            })
        )
    

    }
}