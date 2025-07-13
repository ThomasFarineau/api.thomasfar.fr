import express from 'express';
import update from "./controllers/update";
import config from 'config';

const app = express();
app.use(express.json());

const PORT = config.get<number>('port');

app.get('/', (req, res) => {
    res.send('<h1>Hello world !</h1>');
});

app.use('/update', update);

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
