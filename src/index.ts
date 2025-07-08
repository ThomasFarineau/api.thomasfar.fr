import express from 'express';
import update from "./controllers/update";

const app = express();
app.use(express.json());

// Votre endpoint d'update

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.use('/update', update);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
