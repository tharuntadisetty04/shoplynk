import app from "./app.js";
import connectDB from "./db/db.js";

// Connect to MongoDB and start the server
connectDB()
    .then(() => {
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`App listening on http://localhost:${port}/`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed", err);
    });
