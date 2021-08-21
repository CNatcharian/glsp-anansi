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
import * as fs from 'fs-extra';
import * as path from 'path';

import { Logger } from './logging';

export namespace Validation {
    const log = new Logger();

    export function isValidDirectory(value: string, _previous: string): string {
        if (!fs.pathExistsSync(value)) {
            log.error(`'${value} is not a valid file path!`);
        }
        if (!fs.existsSync(value)) {
            log.error(`The directory '${value}' does not exist!`);
        }

        if (!fs.statSync(value).isDirectory()) {
            log.error(`The file '${value}' is not a directory`);
        }
        return path.resolve(value);
    }
    /**
     * Commander validation function to verify if a given string is a valid semantic version.
     */
    export function isValidVersion(value: string, _previous: string): string {
        const versionRegex = new RegExp('(?:(\\d+)\\.)?(?:(\\d+)\\.)?(\\*|\\d+)(-(.)+)?');
        if (!value.match(versionRegex)?.includes(value) || false) {
            log.error(`The string '${value}' is not a valid semantic version`);
        }
        return value;
    }

}
