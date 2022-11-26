import chalk from 'chalk';
import fse from 'fs-extra';
import path from 'path';
import {execa} from 'execa';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import packageFile from './package.json' assert {type: 'json'};

// We be in a es module so no __dirname available to us so we need to use this
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths to our source and destination folders
const projectRoot = __dirname;
const distRoot = path.join(projectRoot, 'dist');

const step = (name, fn) => async () => {
    return new Promise((resolve) => {
        console.log(chalk.cyan('Building: ') + chalk.green(name));
        fn().then(() => {
            resolve();
            console.log(chalk.cyan('Built: ') + chalk.green(name));
        });
    });
};

const shell = async (cmd) => {
    return execa(cmd, {stdio: ['pipe', 'pipe', 'inherit'], shell: true});
};

const clean = () => {
    return new Promise((resolve) => {
        if(fse.existsSync(distRoot)) {
            console.log(chalk.gray(`\tdeleting: '${distRoot}'`));
            fse.removeSync(distRoot);
        }
        resolve();
    });
};

const copyPackageFile = async () => {
    const packageJson = {
        ...packageFile,
        main: './getJsonPatches.js',
        module: './getJsonPatches.mjs',
        types: './getJsonPatches.d.ts',
        exports: {
            ".": [
                {
                    "types": "./getJsonPatches.d.ts",
                    "import": "./getJsonPatches.mjs",
                    "require": "./getJsonPatches.js"
                },
                "./getJsonPatches.js"
            ],
            "./package.json": "./package.json"
        },
        files: ['*'],
        scripts: {},
        devDependencies: {},
    };

    delete packageJson['source'];
    delete packageJson['jest'];

    await fse.writeFile(path.join(distRoot, 'package.json'), JSON.stringify(packageJson, null, 4));
};

const copyReadme = async () => {
    await fse.copyFile(path.join(projectRoot, 'README.md'), path.join(distRoot, 'README.md'));
};

const copyEsm = async () => {
    await fse.rename(path.join(distRoot, 'getJsonPatches.js'), path.join(distRoot, 'getJsonPatches.mjs'));
};

Promise.resolve(true)
    .then(() => console.log(chalk.bgCyan('Starting build script')))
    .then(step('Clean', clean))
    .then(step('Generating esm', () => shell(`tsc --target esNext --module esNext --outDir ./dist --declaration --traceResolution`)))
    .then(step('Ranaming esm', copyEsm))
    .then(step('Generating cjs', () => shell(`tsc --target es5 --module commonJS --outDir ./dist --traceResolution`)))
    .then(step('Copy package.json file', copyPackageFile))
    .then(step('Copy README.md file', copyReadme))
    .then(() => console.log(chalk.bgCyan('Finished build script')))
    .catch((err) => {
        if(err) console.error(chalk.red(err.stack || err.toString()));
        process.exit(1);
    });
