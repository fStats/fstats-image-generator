import fs from 'fs';
import {execSync} from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    const configFilePath = path.resolve(process.cwd(), 'docker-publish.json');
    const configContent = fs.readFileSync(configFilePath, 'utf-8');
    const config = JSON.parse(configContent);

    const replacedConfig = replacePlaceholders(config, packageData, process.env);

    const {localImageName, tags, externalRegistry} = replacedConfig;

    if (!localImageName || !tags || !externalRegistry) {
        console.error('Configuration is missing required properties.');
        process.exit(1);
    }

    const primaryTag = tags[0];
    console.log(`Building docker image ${localImageName}:${primaryTag}`);
    execSync(`docker build --no-cache -t ${localImageName}:${primaryTag} .`, {stdio: 'inherit'});

    for (const tag of tags) {
        if (tag !== primaryTag) {
            console.log(`Tagging image ${localImageName}:${primaryTag} as ${localImageName}:${tag}`);
            execSync(`docker tag ${localImageName}:${primaryTag} ${localImageName}:${tag}`, {stdio: 'inherit'});
        }
    }

    const {username, password, project, hostname, namespace} = externalRegistry;
    if (!username || !password || !project || !hostname || !namespace) {
        console.error('External registry configuration is incomplete.');
        process.exit(1);
    }
    console.log(`Logging in to docker registry at ${hostname}`);
    const login = spawnSync(
        'docker',
        ['login', hostname, '-u', username, '--password-stdin'],
        {input: password, stdio: ['pipe', 'inherit', 'inherit']}
    );
    if (login.status !== 0) {
        console.error('docker login failed');
        process.exit(1);
    }

    const remoteImageBase = `${hostname}/${namespace}/${project}`;

    for (const tag of tags) {
        const remoteTag = `${remoteImageBase}:${tag}`;
        console.log(`Tagging ${localImageName}:${tag} as ${remoteTag}`);
        execSync(`docker tag ${localImageName}:${tag} ${remoteTag}`, {stdio: 'inherit'});
        console.log(`Pushing image ${remoteTag}`);
        execSync(`docker push ${remoteTag}`, {stdio: 'inherit'});
    }

    console.log('Docker image built and published successfully.');
}

function replacePlaceholders(obj, packageData, env) {
    if (typeof obj === 'string') {
        return obj.replace(/\$\{([^}]+)}/g, (_, key) => {
            if (key.startsWith('PACKAGE_')) {
                const packageKey = key.substring('PACKAGE_'.length).toLowerCase();
                return packageData[packageKey] || '';
            } else if (key.startsWith('DOCKER_')) {
                return env[key] || '';
            }
            return '';
        });
    } else if (Array.isArray(obj)) {
        return obj.map(item => replacePlaceholders(item, packageData, env));
    } else if (obj && typeof obj === 'object') {
        const newObj = {};
        for (const prop in obj) {
            newObj[prop] = replacePlaceholders(obj[prop], packageData, env);
        }
        return newObj;
    }
    return obj;
}

main().catch(err => {
    console.error('Error during docker publish:', err);
    process.exit(1);
});
