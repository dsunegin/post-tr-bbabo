import * as assets from './assets/assets';
import {gtranslateApi} from './assets/gtranslate';

const console = require('./console');
const mysql = require('mysql2');
const {crc16} = require('crc');
const envconf = require('dotenv').config();
const cron = require('node-cron');
//const path = require('path');

if (envconf.error) {
    throw envconf.error;
} // ERROR if Config .env file is missing

const Categories = [
    {langDB: 'uk-UA', category: [103], datefnLocale: 'uk', pn: 0},
    {
        langDB: 'ru-RU',
        category: [87, 88, 89, 90, 87, 87, 88],
        datefnLocale: 'ru',
        pn: 0,
    },
    {langDB: 'en-GB', category: [95], datefnLocale: 'en-GB', pn: 0},
];

//const cron_period = process.env.CRON ? process.env.CRON : 2;        // Default period of cron: 2 min

const connectionPRESS = mysql
    .createConnection({
        host: process.env.DB_PRESSHOST,
        port: process.env.DB_PRESSPORT,
        user: process.env.DB_PRESSUSER,
        database: process.env.DB_PRESSDATABASE,
        password: process.env.DB_PRESSPASSWORD,
    })
    .promise();


const main = async (): Promise<string> => {
    try {

        gtranslateApi.translate({tl:'ru',text:'Hello'});

        //const personArr: Array<string> = person ? person.split('|') : ['bolie'];
        const now: Date = new Date(); // Now
        const aliasUniq: string = '-' + crc16(now.toString()).toString(16);

        return 'Successful';
    } catch (err) {
        console.log(err);
        return err.message;
    }
};
//=================================================================================
if (process.env.CRON) {
    cron.schedule(
        process.env.CRON,
        () => {
            main()
                .then()
                .catch(err => console.error(err));
        },
        {scheduled: true}
    );
} else {
    main()
        .then(created => console.log(created))
        .catch(err => console.error(err));
}