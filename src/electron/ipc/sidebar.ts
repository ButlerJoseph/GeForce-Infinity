import { ipcMain, BrowserWindow } from "electron";
import { GFN_WEBSITE, openPlaytimeDetailsWindow } from "../managers/window";
import { getConfig } from "../managers/config";
import { patchFetchForSessionRequest } from "../main";

export function registerSidebarIpcHandlers(mainWindow: BrowserWindow) {
    ipcMain.on("toggle-sidebar", () => {
        mainWindow.webContents.send("sidebar-toggle");
    });
    ipcMain.on("reload-gfn", () => {
        console.log("[MAIN] reload-GFN handler called");
        mainWindow.loadURL(GFN_WEBSITE);
        mainWindow.webContents.once("did-finish-load", async () => {
            await patchFetchForSessionRequest(mainWindow);
        });
    });
    ipcMain.handle("open-playtime-details", () => {
        return openPlaytimeDetailsWindow(mainWindow);
    });
    ipcMain.handle("get-config", () => {
        return getConfig();
    });
}
