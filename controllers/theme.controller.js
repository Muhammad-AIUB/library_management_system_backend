const UserSettings = require("../models/userSettings.model");

// 🎨 Update Theme
const updateTheme = async (req, res) => {
  try {
    const { userId, theme, customColors } = req.body;

    let userSettings = await UserSettings.findOne({ user: userId });

    if (!userSettings) {
      userSettings = new UserSettings({ user: userId });
    }

    userSettings.theme = theme || userSettings.theme;
    userSettings.customColors = customColors || userSettings.customColors;

    await userSettings.save();
    res
      .status(200)
      .json({ message: "Theme updated successfully", data: userSettings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🌙 Get User Theme
const getUserTheme = async (req, res) => {
  try {
    const { userId } = req.params;

    const userSettings = await UserSettings.findOne({ user: userId });

    if (!userSettings) {
      return res.status(404).json({ message: "User settings not found." });
    }

    res.status(200).json({ data: userSettings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔄 Reset Theme to Default
const resetTheme = async (req, res) => {
  try {
    const { userId } = req.params;

    const userSettings = await UserSettings.findOne({ user: userId });

    if (!userSettings) {
      return res.status(404).json({ message: "User settings not found." });
    }

    userSettings.theme = "light";
    userSettings.customColors = {
      background: "#ffffff",
      text: "#000000",
      accent: "#6200ea",
    };

    await userSettings.save();
    res
      .status(200)
      .json({ message: "Theme reset to default", data: userSettings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { updateTheme, getUserTheme, resetTheme };
