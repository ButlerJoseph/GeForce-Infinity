import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaSpinner } from "react-icons/fa";

interface PlaytimeData {
    totalHours?: number;
    totalMinutes?: number;
    lastPlayed?: string;
    gamesPlayed?: number;
}

export const PlaytimeSection: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [playtimeData, setPlaytimeData] = useState<PlaytimeData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPlaytimeData();
    }, []);

    const loadPlaytimeData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to fetch playtime data from NVIDIA API
            // This is a placeholder - actual implementation would require NVIDIA API access
            const response = await fetch(
                "https://www.nvidia.com/en-gb/account/gfn/playtime/details/",
                { credentials: "include" }
            );

            if (response.ok) {
                // Parse playtime data from response
                // Note: This is a simplified example - actual parsing would be more complex
                const html = await response.text();
                
                // Extract data from HTML (simplified)
                setPlaytimeData({
                    totalHours: 0,
                    totalMinutes: 0,
                    lastPlayed: "N/A",
                    gamesPlayed: 0,
                });
            } else {
                setError("Unable to fetch playtime data. Please log in to your NVIDIA account.");
            }
        } catch (err) {
            console.error("Failed to load playtime data:", err);
            setError("Could not load playtime data. Open in NVIDIA account to view.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPlaytime = async () => {
        try {
            await window.electronAPI.openPlaytimeDetails();
        } catch (err) {
            console.error("Failed to open playtime details:", err);
            alert("Failed to open playtime details.");
        }
    };

    return (
        <section className="p-4 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">
                Playtime Details
            </h3>
            <div className="bg-red-600 border-2 border-red-700 rounded-lg p-6 text-center text-gray-200 min-h-24 flex flex-col items-center justify-center">
                {loading ? (
                    <>
                        <FaSpinner className="text-2xl mb-2 animate-spin" />
                        <p className="text-sm">Loading playtime data...</p>
                    </>
                ) : error ? (
                    <p className="text-sm">{error}</p>
                ) : playtimeData ? (
                    <div className="text-left w-full">
                        <p className="text-sm mb-2">
                            <strong>Total Hours:</strong> {playtimeData.totalHours || 0}h
                        </p>
                        <p className="text-sm mb-2">
                            <strong>Games Played:</strong> {playtimeData.gamesPlayed || 0}
                        </p>
                        <p className="text-sm">
                            <strong>Last Played:</strong> {playtimeData.lastPlayed || "N/A"}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm mb-2">Playtime information unavailable</p>
                        <p className="text-xs text-gray-300">
                            Click the button below to view in your NVIDIA account
                        </p>
                    </>
                )}
            </div>
            <button
                onClick={() => void handleOpenPlaytime()}
                disabled={loading}
                className="w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
                <FaExternalLinkAlt className="text-sm" />
                {loading ? "Loading..." : "View Playtime Details"}
            </button>
        </section>
    );
};
