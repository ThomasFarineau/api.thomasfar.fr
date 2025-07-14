import Koa from 'koa';
import bodyParser from '@koa/bodyparser';
import Router from '@koa/router';
import config from 'config';
import updateController from '@controllers/UpdateController';

const app = new Koa();
const router = new Router();
const PORT = config.get<number>('port');

app.use(bodyParser());

router.get('/', async (ctx) => {
    ctx.type = 'html';
    ctx.body = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Hello API</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`;
});

router.post('/update', updateController.updateHandler);

app.use(router.routes());
app.use(router.allowedMethods());

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});