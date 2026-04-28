import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

export const PlaytimeSection: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleOpenPlaytime = async () => {
        try {
            setLoading(true);
            await window.electronAPI.openPlaytimeDetails();
        } catch (err) {
            console.error("Failed to open playtime details:", err);
            alert("Failed to open playtime details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="p-4 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">
                Playtime Details
            </h3>
            <div className="bg-red-600 border-2 border-red-700 rounded-lg p-6 text-center text-gray-200 min-h-24 flex flex-col items-center justify-center">
                <p className="text-sm mb-3">Playtime information will be displayed here</p>
                <p className="text-xs text-gray-300 mb-4">
                    Click the button below to view detailed playtime statistics from NVIDIA
                </p>
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
