import ExamplePlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class SettingsTab extends PluginSettingTab {
    plugin: ExamplePlugin;

    constructor(app: App, plugin: ExamplePlugin) {
      super(app, plugin);
      this.plugin = plugin;
    }

    display(): void{
        let { containerEl } = this;

        containerEl.empty();

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

    }
}