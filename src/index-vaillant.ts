import * as assets from './assets/assets';
import {translateApi} from './assets/gtranslate';

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
    {
        langDB: 'ru-RU',
        category: 112
    },

];
const WEBSITE_ROOT_PATH = "/var/www/html-bublbe";

const connectionPRESS = mysql
    .createConnection({
        host: process.env.DB_PRESSHOST,
        port: process.env.DB_PRESSPORT,
        user: process.env.DB_PRESSUSER,
        database: process.env.DB_PRESSDATABASE,
        password: process.env.DB_PRESSPASSWORD,
    })
    .promise();
const connectionVAILLANT = mysql
    .createConnection({
        host: process.env.DB_PRESSHOST,
        port: process.env.DB_PRESSPORT,
        user: process.env.DB_PRESSUSER,
        database: 'h2sh600_bitrix',
        password: process.env.DB_PRESSPASSWORD,
    })
    .promise();


const main = async (): Promise<string> => {
    try {
        let sql = `SELECT ID FROM b_iblock_element ORDER BY ID ASC`;
        let resultV = await connectionVAILLANT.query(sql);
        if (resultV[0].length == 0) return "NO Source Articles DATA";
        const srcArr = resultV[0];
        let PostID = srcArr[0].ID;


        sql = `SELECT * FROM b_iblock_element WHERE ID = '${PostID}'`;
        let result = await connectionVAILLANT.query(sql);
        let srcArticle = result[0][0];

        let PostTitle = `Технологии Vailant: ${srcArticle.NAME}`;
        //let PostImgSrc = await assets.getRandomImage('/var/www/html-bublbe/images/www/vaillant/technology');
        let PostImgSrc = '/var/www/html-bublbe/images/www/vaillant/technology/vaillant-tech0003.jpg';
        PostImgSrc = PostImgSrc.replace(WEBSITE_ROOT_PATH,"");
        let trPostContent = `<img src="${PostImgSrc}" />  ${srcArticle.PREVIEW_TEXT} <hr> ${srcArticle.DETAIL_TEXT}`;


        const alias = assets.aliasSlug(PostTitle);

        sql =
            "INSERT INTO os0fr_content (title, alias, introtext, catid,  language, state, created, publish_up, created_by,access,note) VALUES (?,?,?,?,?,1,NOW(),NOW(),84,1,?)";
        const post = [PostTitle, alias, trPostContent, Categories[0].category,  Categories[0].langDB, 'vaillant'];
        await connectionPRESS.query(sql, post);

        // DELETE SOURCE POST
        sql = "DELETE FROM b_iblock_element WHERE ID = " + PostID;
        await connectionVAILLANT.query(sql);

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