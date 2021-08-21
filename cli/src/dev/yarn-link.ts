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
import * as sh from 'shelljs';

import { Logger } from '../common/logging';
import { Validation } from '../common/validation';
import { Yarn } from '../yarn';

const program = new Command()
    .name('yarn link')
    .showHelpAfterError()
    .argument('<baseDir>', 'The root directory of the GLSP VSCode workspace', Validation.isValidDirectory)
    .description('Configure the GLSP repositories for local development using yarn link')
    .alias('ll')
    .option('-u , --unlink', 'If true, the local packages will be unlinked', false)
    .option('-d , --log.debug', 'Enable additional log.debug log output', false)
    .option('-l , --linkDir <path>', 'The director where the symlinks for linked package are stored. Is "~/.config/yarn/link" if not specified.', Validation.isValidDirectory);

program.parse();

const options = program.opts();
const rootDir = program.args[0];
const log = new Logger(options.log.debug);

if (options.unlink) {
    doUnlink(rootDir);
} else {
    doLink();
}

function doLink(): void {
    log.info('Start linking all necessary packages');
    linkGLSPClient(rootDir);
    linkTheiaIntegration(rootDir);
}

function initLink(baseDir: string, packageDir: string): void {
    const cmd = `cd ${baseDir}/${packageDir} && ${Yarn.link(options.linkDir)}`;
    log.debug(`Execute sh command: ${cmd}`);
    sh.exec(cmd);
}

function link(baseDir: string, packageName: string): void {
    const cmd = `cd ${baseDir} && ${Yarn.link(options.linkDir)} ${packageName}`;
    log.debug(`Execute sh command: ${cmd}`);
    sh.exec(`cd ${baseDir} && ${Yarn.link(options.linkDir)} ${packageName}`);
}

function build(packageDir: string): void {
    if (sh.exec(`cd ${packageDir} && ${Yarn.build(true)}`).code !== 0) {
        log.error(`Execution of '${Yarn.build}' failed in directory: '${packageDir}`);
    }
}

function linkGLSPClient(baseDir: string): void {
    log.debug('Configure yarn link for: ', 'glsp-client');
    const base = `${baseDir}/glsp-client`;
    initLink(base, 'examples/workflow-glsp');
    initLink(base, 'packages/client');
    initLink(base, 'packages/protocol');
    build(base);
    initLink(base, 'node_modules/sprotty');
}

function linkTheiaIntegration(baseDir: string): void {
    log.debug('Configure yarn link for: ', 'glsp-client');
    const base = `${baseDir}/glsp-theia-integration`;
    link(base, 'sprotty');
    link(base, '@eclipse-glsp/client');
    link(base, '@eclipse-glsp/protocol');
    build(base);
    log.info('LINKING SUCCESSUFLL');

}

function doUnlink(baseDir: string): void {
    log.info('Start unlinking all  packages');
}

