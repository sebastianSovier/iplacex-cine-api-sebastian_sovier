import express from "express"
import cors from "cors"
import { peliculaRoutes, actorRoutes } from './src/routes.js'
import client from "./src/common/db.js";
const PORT = 10000 || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", peliculaRoutes);
app.use("/api", actorRoutes);

const options = {
    tls: true,
    sslValidate: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  };
await client.connect(options).then(() => {
    console.log("db connected")
    app.listen(PORT, () => {
        console.log("Server running in port ", PORT)
        console.log(`Example app listening at http://localhost:${PORT}`)
    })
}).catch((e) => { console.error(e) });

app.get("/", (req, res) => {
    res.json("Bienvenido al cine Iplacex")
});
