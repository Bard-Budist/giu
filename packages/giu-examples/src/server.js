import http from 'http';
import path from 'path';
import { mainStory, chalk } from 'storyboard';
import 'storyboard-preset-console';
import express from 'express';

const PORT = 8080;
const expressApp = express();
expressApp.use('/api', (req, res) => { res.json({}); });
expressApp.use(express.static(path.join(process.cwd(), 'lib/public')));
const httpServer = http.createServer(expressApp);
httpServer.listen(PORT);
mainStory.info('http', `Listening on port ${chalk.cyan.bold(PORT)}`);
mainStory.info('http', `Check out: http://localhost:${PORT}/demo1.html`);
mainStory.info('http', `Check out: http://localhost:${PORT}/index.html`);
mainStory.info('http', 'Both examples above run after `npm run buildExamplesSsrDev`');
mainStory.info('http', 'The first example works also with the simpler `npm run buildExamplesDev`');
