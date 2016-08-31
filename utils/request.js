import axios from 'axios';
import config from '../config/tinyapi';

const padStrUrl   = Array(60).join(' ');
const padStrState = Array(16).join(' ');
const padStrTime  = Array(5).join(' ');

export const SCOPE_SITE = 'SITE';
export const SCOPE_ADMIN = 'ADMIN';

/**
 * @param {String} url
 * @param {String} scope
 *
 * @return {axios.Promise}
 */
export default function request(url, scope = SCOPE_SITE) {
    console.info(`[${scope}][API CALL] ${pad(padStrUrl, url)} ${pad(padStrState, 'started')}`);

    const startTime = new Date().getTime();

    return axios.get(config.url + url, {
        auth:    config.authOptions,
        headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }
    }).then((response) => {
        const endTime = new Date().getTime();

        console.info(`[${scope}][API CALL] ${pad(padStrUrl, url)} ${pad(padStrState, 'finished in')} ${pad(padStrTime, (endTime - startTime).toString())}ms`);

        return response;
    }).catch(function (response) {
        let error = 'Error: ';
        if (response instanceof Error) {
            error = `${error} ${response.message}`;
        } else {
            error = `${error} ${response.status} ${response.data}`;
        }
        const endTime = new Date().getTime();

        console.info(`[${scope}][API CALL] ${pad(padStrUrl, url)} ${pad(padStrState, 'gone down in')} ${pad(padStrTime, (endTime - startTime).toString())}ms`);
    });
}

function pad(pad, str, padLeft) {
    if (typeof str === 'undefined')
        return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        if (str.length <= pad.length) {
            return (str + pad).substring(0, pad.length);
        } else {
            return (str + pad).substring(0, pad.length - 3) + '...';
        }
    }
}
