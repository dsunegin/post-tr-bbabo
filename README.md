# post-tr-bbabo - client for gtranslate proxy

#### Clone & Install Dependencies
```bash
git clone https://github.com/dsunegin/post-tr-bbabo
cd post-tr-bbabo
npm install
```

Configure your env:
```
cp .env.example .env
```

#### Specify environment in .env file:

```
DB_PRESSHOST="localhost"
DB_PRESSPORT=3306
DB_PRESSUSER="press_user"
DB_PRESSDATABASE="press"
DB_PRESSPASSWORD="psw_press_user"
BEARER = "BEARER_PASSWORD"
```

## Running `post-tr-bbabo`

Either configure `post-tr-bbabo` to run by pm2 (node process manager) or manually start the `post-tr-bbabo` process.

To manually start `post-tr-bbabo` once it is installed:

```bash
npm run compile
npm run start
```

### Start the pm2 with cron 

```bash
npm run compile
./pm2-post-tr-bbabo.sh
```
 

## Contact
Denis Sunegin `dsunegin@gmail.com`
