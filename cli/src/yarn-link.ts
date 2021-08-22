#!/usr/bin/env node
/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as sh from 'shelljs';

import { Logger } from './common/logging';
import { Package, Repository, YarnCommand } from './common/util';
import { Validation } from './common/validation';

function initLink(baseDir: string, packageDir: string): void {
    const cmd = `cd ${baseDir}/${packageDir} && ${YarnCommand.link(options.linkDir)}`;
    log.debug(`Execute sh command: ${cmd}`);
    sh.exec(cmd);
}

function link(baseDir: string, packageName: string): void {
    const cmd = `cd ${baseDir} && ${YarnCommand.link(options.linkDir)} ${packageName}`;
    log.debug(`Execute sh command: ${cmd}`);
    sh.exec(`cd ${baseDir} && ${YarnCommand.link(options.linkDir)} ${packageName}`);
}

function build(packageDir: string): void {
    if (sh.exec(`cd ${packageDir} && ${YarnCommand.build(true)}`).code !== 0) {
        log.error(`Execution of '${YarnCommand.build}' failed in directory: '${packageDir}`);
    }
}
/**
 * If the sprotty sources should be linked as well, we also have to link all theia packages
 * that for sprotty-theia otherwise DI does not work. To achieve this we build glsp-theia-integration
 * and then link all @theia packages from the node modules.
 * @returns List of names of all linked @theia packages
 */
function linkTheiaDependencies(): string[] {
    log.info('Configure @theia dependencies for local development');
    build(`${rootDir}/${Repository.GLSP_THEIA_INTEGRATION}`);
    const nodeModulesPath = `${rootDir}/${Repository.GLSP_THEIA_INTEGRATION}/node_modules/@theia`;
    const theiaPackages = fs.readdirSync(nodeModulesPath);
    theiaPackages.forEach(packageName => initLink(nodeModulesPath, packageName));
    return theiaPackages.map(packageName => `@theia/${packageName}`);
}

function linkSprotty(): void {
    log.info(`Configure yarn link for '${Repository.SPROTTY}'`);
    const base = `${rootDir}/${Repository.SPROTTY}`;
    initLink(base, '');
    build(base);
}

function linkSprottyTheia(theiaPackages: string[]): void {
    log.info(`Configure yarn link for '${Repository.SPROTTY_THEIA}'`);
    const base = `${rootDir}/${Repository.SPROTTY_THEIA}`;
    link(base, Package.SPROTTY);
    theiaPackages.forEach(packageName => link(base, packageName));
    initLink(base, '');
    build(base);
}

function linkGLSPClient(): void {
    log.info(`Configure yarn link for '${Repository.GLSP_CLIENT}'`);
    const base = `${rootDir}/${Repository.GLSP_CLIENT}`;
    initLink(base, 'examples/workflow-glsp');
    initLink(base, 'packages/client');
    initLink(base, 'packages/protocol');
    build(base);
    // If the sprotty sources should no be linked, we link this glsp-client sprotty version. Otherwise DI won't work.
    if (!options.sprotty) {
        initLink(base, 'node_modules/sprotty');
    }

}

function linkTheiaIntegration(): void {
    log.info(`Configure yarn link for '${Repository.GLSP_THEIA_INTEGRATION}'`);
    const base = `${rootDir}/${Repository.GLSP_THEIA_INTEGRATION}`;
    link(base, Package.SPROTTY);
    link(base, Package.GLSP_CLIENT);
    link(base, Package.GLSP_PROTOCOL);
    link(base, Package.WORKFLOW_GLSP);
    if (options.sprotty) {
        link(base, Package.SPROTTY_THEIA);
    }
    build(base);
}

/**
 * Main program
 */
const program = new Command()
    .name('yarn link')
    .showHelpAfterError()
    .description('Configure the GLSP repositories for local development using yarn link')
    .argument('<baseDir>', 'The root directory of the GLSP VSCode workspace', Validation.isValidDirectory)
    .option('-l , --linkDir <path>', 'Lokal linking directory. (default: "~/.config/yarn/link")', Validation.isValidDirectory)
    .option('-d , --debug', 'Additional debug log output (default: false)', false)
    .option('-s , --sprotty', 'Also link sprotty sources. (default: false)', false);

program.parse();

const options = program.opts();
const rootDir = program.args[0];
const log = new Logger(options.debug);

log.info('Start linking all necessary packages');
if (options.sprotty) {
    const theiaPackages = linkTheiaDependencies();
    linkSprotty();
    linkSprottyTheia(theiaPackages);
}
console.log(linkGLSPClient);
console.log(linkTheiaIntegration);
log.info('LINKING SUCCESSFUL');
