# gtranslate - google translate proxy based on fastify web server

#### Clone & Install Dependencies
```bash
git clone https://github.com/dsunegin/gtranslate
cd post-bankru
npm install
```

Configure:
```
const PORT = 8085;
const PAGES_NUM = 1;
const PAGE_TIMEOUT = 60000;
```

## Running `gtranslate`

Either configure `gtranslate` to run by pm2 (node process manager) or manually start the `gtranslate` process.

To manually start `gtranslate` once it is installed:

```bash
npm run compile
npm run start
```

### Start the pm2 

```bash
npm run compile
./pm2-gtranslate.sh
```
 
You must have installed pm2 process manager to run pm2-gtranslate.sh script.

## *Notice

Fastify hc-pages Plugin used in project is written  for node 14.0 and later.

To avoid error in node version < 14.0 modify line 90:60 (hc-pages.js):

const browser = await puppeteer_1.launch(launchOptions ?? defaultLaunchOptions);

to ->

const browser = await puppeteer_1.launch(launchOptions || defaultLaunchOptions);

in fastify-hc-pages Plugin file:
 
node_modules\@uyamazak\fastify-hc-pages\dist\src\hc-pages.js


## Contact
Denis Sunegin `dsunegin@gmail.com`
