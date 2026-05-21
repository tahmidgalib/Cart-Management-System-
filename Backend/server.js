const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "live_cart2"
}).promise();
app.get("/users", async (req, res) => {
    try {
        const [rows]= await db.execute('SELECT * FROM `users`');
        console.log(rows);
        res.json(rows);
    } catch (error) {
      console.error(error);
        res.status(500).json({ error: "Database Error" });
    }
});
app.post("/users", async (req, res) => {
    try {
        const data = req.body;
        console.log(data);

        // Example database insert (uncomment if needed)
    
        const sql = `
            INSERT INTO users 
            (name, universityId, type, department, pass) 
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.execute(sql, [
            data.Sname,
             data.id,
            data.type,
          data. dept,
           data.password
        ]);
        

        res.send("Data inserted successfully");

    } catch (error) {
        console.error(error);
        res.status(500).send("Database Error");
    }
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});