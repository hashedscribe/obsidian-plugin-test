import ExamplePlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class SettingsTab extends PluginSettingTab {
  plugin: ExamplePlugin;

  constructor(app: App, plugin: ExamplePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Batch add")
      .setDesc("Number of days to batch add")
      .addText((text) =>
        text
          .setPlaceholder("31")
          .setValue(this.plugin.settings.batchAdd)
          .onChange(async (value) => {
            this.plugin.settings.batchAdd = value;
            await this.plugin.saveSettings();
          })
      );
  }
}