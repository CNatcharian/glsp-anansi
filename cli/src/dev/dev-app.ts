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

const program = new Command()
    .name('dev')
    .description('Collection of commands for contributing to and devloping with Eclipse GLSP.')
    .enablePositionalOptions()
    .showHelpAfterError()
    .command('yarn-link <baseDir>', 'Configure the GLSP repositories for local development using yarn link', { executableFile: 'yarn-link' })
    .command('server-download <destination>', 'Downloads a specific version of the Workflow Example Java Server from the maven repository',
        { executableFile: 'server-download' })
    .addHelpText('afterAll', '\n Copyright (c) 2021 EclipseSource and others.');

program.parse(process.argv);
