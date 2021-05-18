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
        category: [87, 88, 112, 89, 90, 93],
        lang: 'ru'
    },
    {   langDB: 'en-GB',
        category: [94, 95, 114, 96, 98, 99],
        lang: 'en'
    },
];


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
        const inClauseSrc = Categories[0].category.map(id=>"'"+id+"'").join();
        let sql = `SELECT id, catid FROM os0fr_content WHERE catid IN (${inClauseSrc}) && id < 35364 ORDER BY id ASC`;
        let result = await connectionPRESS.query(sql);

        if (result[0].length == 0) return "NO Source Articles DATA";
        const srcArr = result[0];

        sql = `SELECT id, translate_from FROM os0fr_content WHERE translate_from > 0`;
        result = await connectionPRESS.query(sql);

        const TranslatedArr = result[0];
        //const TranslatedArr = [310,311];
        //const TranslatedArr = [3];
        const TranslatedArrIdx = TranslatedArr.map( (el: any) => el.translate_from);
        let srcArrFiltered = srcArr.filter( (elem1: any) => !TranslatedArrIdx.includes(elem1.id));

        let srcArticleId = null;
        let srcArticle;
        while (!srcArticleId) {
            // Fetch Article from DB
             srcArticleId = srcArrFiltered[0].id;
            sql = `SELECT * FROM os0fr_content WHERE id = '${srcArticleId}'`;
            result = await connectionPRESS.query(sql);
            srcArticle = result[0][0];

            const aText = srcArticle['introtext'] + srcArticle['fulltext'];
            if (aText.indexOf('<table')>=0) { srcArrFiltered.shift(); srcArticleId = null;continue;};
            if (aText.indexOf('watch?v=')>=0) { srcArrFiltered.shift(); srcArticleId = null;continue;};
        }

        const srcArticleCatId = srcArticle['catid'];
        const trArticleCatId = Categories[1].category[Categories[0].category.indexOf(srcArticleCatId)];

        let PostContent = srcArticle['introtext'] + srcArticle['fulltext'];
        const  regexImg= /<img.*?src=\"(.*?)\"/gs;
        let extrImg = regexImg.exec(PostContent);
        let PostImgSrc = extrImg !== null ? extrImg[1] : "";


        PostContent = PostContent.replace(/<a\/?[^>]+>|<\/a>/igs,'');        // Strip ALL <a> tags from text but leave inner text.
        //PostContent = PostContent.replace(/<p>|<\/p>/igs,'');        // Strip ALL <p> tags from text but leave inner text.
        PostContent = PostContent.replace(/<img.*?>/igs, '');        // Strip ALL <img>
        PostContent = PostContent.replace(/<hr.*?>/igs, '');        // Strip ALL <hr>
        PostContent = PostContent.replace(/<br.*?>/igs, '');        // Strip ALL <br>
        PostContent = PostContent.replace(/bbabo.net/igs, '');        // Strip ALL <br>
        PostContent = PostContent.replace(/\&nbsp\;/igs, '');
        PostContent = PostContent.replace(/\&laquo\;/igs, '');
        PostContent = PostContent.replace(/\&raquo\;/igs, '');
        PostContent = PostContent.replace(/\&mdash\;/igs, '');
        PostContent = PostContent.replace(/\&ndash\;/igs, '');
        PostContent = PostContent.replace(/\&lt\;/igs, '');
        PostContent = PostContent.replace(/\&gt\;/igs, '');
        PostContent = PostContent.replace(/\&amp\;/igs, '');

        translateApi.setToken(process.env.BEARER || 'default_Bearer');
        const PostTitle: string = await translateApi.translate({tl:'en',text:srcArticle['title']});
        await assets.wait(2000);
        let tr_text = await  translateApi.translate({tl:'en',text:PostContent});

        //if (tr_text.length < 2000) {tr_text.replace(/\./igs, '</p><p>');};

        let trPostContent = `<img src="${PostImgSrc}" />  <p>${tr_text}</p>`;

        const now: Date = new Date(); // Now
        const aliasUniq: string = '-' + crc16(now.toString()).toString(16);
        const alias = assets.aliasSlug(PostTitle) + aliasUniq;

        //let tr_test = await  translateApi.test();
        //let tr_text = await  translateApi.translate({tl:'ru',text:'Hello'});
        sql =
            'INSERT INTO os0fr_content (title, alias, introtext, catid, translate_from, language, state, created, publish_up, created_by,access) VALUES (?,?,?,?,?,?,1,NOW(),NOW(),84,1)';
        const post = [PostTitle, alias, trPostContent, trArticleCatId, srcArticleId, 'en-GB'];
        await connectionPRESS.query(sql, post);

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