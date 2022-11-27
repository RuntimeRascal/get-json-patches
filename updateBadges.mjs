import chalk from 'chalk';
import {execa} from 'execa';

const shell = async (cmd) => {
    return execa(cmd, {stdio: ['pipe', 'pipe', 'inherit'], shell: true});
};

const step = (name, fn) => async () => {
    return new Promise((resolve) => {
        console.log(chalk.cyan('Start Step: ') + chalk.green(name));
        fn().then((r) => {
            resolve(r);
            console.log(chalk.cyan('Finish Step: ') + chalk.green(name));
        });
    });
};

const readmeChanged = async () => {
    var updated = await shell('git diff --name-only README.md');
    return updated.stdout === 'README.md';
};

Promise.resolve(true)
    .then(() => console.log(chalk.bgCyan('Starting update badges script')))
    .then(step('generate coverage', () => shell('npm run cover')))
    .then(step('update badges', () => shell("istanbul-badges-readme --logo='jest' --style='for-the-badge'")))
    .then(step('check if readme updated', readmeChanged))
    .then(async (readmeUpdated) => {
        if(!readmeUpdated) {
            console.log(chalk.bgGreen('Badges are up to date!'));
            return;
        }
        console.log(chalk.bgRed('Badges are out of date!'));
        await shell('git add README.md');
        await shell('git commit -m "Update badges"');
        console.log(chalk.bgRed('Updated and committed readme.md'));
    })
    .then(() => console.log(chalk.bgCyan('Finished build script')))
    .catch((err) => {
        if(err) console.error(chalk.red(err.stack || err.toString()));
        process.exit(1);
    });
