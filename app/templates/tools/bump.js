// @flow

import fs from 'fs';
import moment from 'moment';
import { exec } from 'child_process';
import { js_beautify as beautify } from 'js-beautify'; // eslint-disable-line camelcase
import pkg from '../package.json';

const argv = process.argv[3];

/**
 * Validate argument
 *
 * @return {Promise}
 */
function validateParam(): Promise<void> {
    return new Promise((resolve: Function, reject: Function) => {
        if (argv !== 'patch' && argv !== 'minor' && argv !== 'major') {
            reject('Specify valid semver version type to bump!');
            return;
        }

        resolve();
    });
}

/**
 * Update build time
 *
 * @return {Promise}
 */
function updateBuildTime(): Promise<void> {
    let time;
    let content;

    return new Promise((resolve: Function, reject: Function) => {
        time = moment().format('DD.MM.YYYY HH:mm:ss (ZZ)');
        pkg.time = time;

        // eslint-disable-next-line camelcase
        content = beautify(JSON.stringify(pkg), { indent_size: 2, end_with_newline: true });

        fs.writeFile('package.json', content, (err: any) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

/**
 * Bump build version
 *
 * @return {Promise}
 */
function bumpVersion(): Promise<void> {
    return new Promise((resolve: Function, reject: Function) => {
        const oldVersion = pkg.version;
        let newVersion;

        exec(`npm --no-git-tag-version version ${argv}`, (err: any, stdout: any) => {
            if (err) {
                reject(err);
                return;
            }

            newVersion = stdout.slice(0, -1);

            console.log(`Bumped v${oldVersion} to ${newVersion} with type: ${argv}`);
            resolve();
        });
    });
}

export default function bump(): Promise<void> {
    return validateParam()
        .then(updateBuildTime)
        .then(bumpVersion);
}
