import DiscordRPC, { Client as DiscordRPCClient } from "@t0msk/discord-rpc";

export type RpcClient = {
    login: (options: { clientId: string }) => Promise<void>;
    setActivity: (activity: {
        state: string;
        largeImageKey: string;
        largeImageText: string;
        startTimestamp: Date;
    }) => void;
};

export const clientId = "1270181852979789825";
let rpcClient: DiscordRPCClient | undefined;
let startTimestamp: Date;

export function initRpcClient(start: Date, initialTitle: string) {
    startTimestamp = start;
    try {
        const client = new DiscordRPC.Client({ transport: "ipc" });

        client.on("ready", () => {
            console.log("Discord RPC connected");
            rpcClient = client;
            updateActivity(initialTitle);
        });

        client.on("disconnected", () => {
            console.log("Discord RPC disconnected");
            rpcClient = undefined;
        });

        client.login({ clientId }).catch((err: Error) => {
            console.error("Discord RPC login failed:", err);
            rpcClient = undefined;
        });
    } catch (err) {
        console.error("RPC init error:", err);
    }
}

export function updateActivity(gameTitle: string | null) {
    if (!rpcClient) return;

    rpcClient.setActivity({
        state: gameTitle ? `Playing ${gameTitle}` : "Idling...",
        largeImageKey: "infinity_logo",
        largeImageText: "GeForce Infinity",
        startTimestamp,
    }).catch((err: Error) => {
        console.error("Failed to set activity:", err);
    });
}
