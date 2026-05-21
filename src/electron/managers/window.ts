import { app, BrowserWindow } from "electron";
import path from "path";
import { getConfig } from "./config";
import { getIconPath } from "../utils";

export const GFN_WEBSITE = "https://play.geforcenow.com/";
export const PLAYTIME_DETAILS_URL =
    "https://www.nvidia.com/en-gb/account/gfn/playtime/details/";

const preloadPath = path.resolve(__dirname, "..", "preload.js");
let playtimeWindow: BrowserWindow | null = null;

export function createMainWindow(): BrowserWindow {
    const iconPath = getIconPath();

    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 1000,
        title: "GeForce Infinity",
        icon: iconPath || undefined,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            devTools: !app.isPackaged,
            webSecurity: true,
        },
        autoHideMenuBar: true,
    });

    const config = getConfig();
    if (
        typeof config.userAgent === "string" &&
        config.userAgent.trim() !== ""
    ) {
        mainWindow.webContents.setUserAgent(config.userAgent);
        console.log("[UserAgent] Overridden:", config.userAgent);
    } else {
        console.log("[UserAgent] Using default");
    }

    //mainWindow.webContents.openDevTools();
    return mainWindow;
}

export function openPlaytimeDetailsWindow(
    parentWindow: BrowserWindow
): BrowserWindow {
    if (playtimeWindow && !playtimeWindow.isDestroyed()) {
        if (playtimeWindow.isMinimized()) {
            playtimeWindow.restore();
        }
        playtimeWindow.focus();
        return playtimeWindow;
    }

    const iconPath = getIconPath();
    const config = getConfig();

    playtimeWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        title: "GFN Playtime",
        icon: iconPath || undefined,
        parent: parentWindow,
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            devTools: !app.isPackaged,
            webSecurity: true,
            session: parentWindow.webContents.session,
        },
    });

    if (config.userAgent.trim() !== "") {
        playtimeWindow.webContents.setUserAgent(config.userAgent);
    }

    playtimeWindow.once("ready-to-show", () => {
        playtimeWindow?.show();
    });
    playtimeWindow.on("closed", () => {
        playtimeWindow = null;
    });
    void playtimeWindow.loadURL(PLAYTIME_DETAILS_URL);

    return playtimeWindow;
}
