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

import { log } from '../common/logging';
import { ProjectSet } from '../common/project-configuration';
import * as Validation from '../common/validation';
import { executeYarnLink } from '../yarn-link';

const program = new Command()
    .name('yarn link')
    .showHelpAfterError()
    .description('Configure the GLSP repositories for local development using yarn link')
    .argument('<baseDir>', 'The root directory of the GLSP VSCode workspace', Validation.isValidDirectory)
    .option('-l , --linkDir <path>', 'Local linking directory. (default: "~/.config/yarn/link")', Validation.isValidDirectory)
    .option('-d , --debug', 'Additional debug log output (default: false)', false)
    .option('-p , --projectSet <projectSet>', `Define the set of projects that should be linked. (${ProjectSet.getAll().join(' | ')})`
        , isValidProjectSet, ProjectSet.THEIA)
    .option('-s , --sprotty', 'Also link sprotty sources. (default: false)', false);

program.parse();

const options = program.opts();

executeYarnLink({
    rootDir: program.processedArgs[0],
    linkSprottySource: options.sprotty,
    debugOutput: options.debug,
    linkDir: options.linkDir,
    projectSet: options.projects
}
);

/**
 * Validates wether a given string describes a valid {@link ProjectSet}. The string literal needs
 * to match the enum literal (case-insensitive).
 * Logs an error message and exits the application if a validation error occurs.
 * @param value The string value that should be validated
 * @returns The {@link ProjectSet} literal that corresponds to the string value.
 */
export function isValidProjectSet(value: string): ProjectSet {
    // eslint-disable-next-line guard-for-in

    const projectSet = ProjectSet.create(options.projectSet);
    if (!projectSet) {
        log.error(`${value} is not a valid project set type. Valid types are ${ProjectSet.getAll().join(', ')}`);
    }

    return projectSet!;
}
