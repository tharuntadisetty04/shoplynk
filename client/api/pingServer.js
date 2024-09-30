import axios from "axios";

export default async function handler(req, res) {
    try {
        const serverUrl =
            import.meta.env.VITE_API_URL || "https://shoplynk.onrender.com";

        const response = await axios.get(serverUrl);

        res.status(200).json({ message: "Ping successful", data: response.data });
    } catch (error) {
        console.error("Error pinging server:", error);

        res.status(500).json({ message: "Ping failed", error: error.message });
    }
}
