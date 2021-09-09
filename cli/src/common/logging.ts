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
import { exit } from 'process';
import * as sh from 'shelljs';

/**
 * Utility class to provide simple console logs.
 * Provides the three basic log levels:
 * - "Info" for logging general messages during command execution.
 * - "Error" for logging an error message. The application is stopped with exit code 1 afterwards.
 * - "Debug" for printing optional debug out. Will only be printed if the {@link Logger.isDebugEnabled} flag is true.
 *
 * If not configured properly Node.js console logs are often not displayed inside of docker container terminals. As a
 * workaround the Logger uses shell `echo` instead of `console.log` when executed in a docker environment.
 */
export class Logger {
    protected runningInDocker = isDocker();

    constructor(protected isDebugEnabled: boolean = false) { }

    enableDebugOutput(enable: boolean): void {
        this.isDebugEnabled = enable;
    }
    info(message?: any, ...optionalParams: any[]): void {
        this.print(`INFO: ${message}`, ...optionalParams);
    }

    debug(message?: any, ...optionalParams: any[]): void {
        if (this.isDebugEnabled) {
            this.print(`DEBUG: ${message}`, ...optionalParams);
        }
    }

    error(message?: any, ...optionalParams: any[]): void {
        this.print(`ERROR: ${message}`, ...optionalParams);
        exit(1);
    }

    protected print(message: string, ...optionalParams: any[]): void {
        this.runningInDocker ? sh.echo(message, ...optionalParams)
            : console.log(message, ...optionalParams);
    }
}

/** Reusable global logger */
export const log = new Logger();

function hasDockerEnv(): boolean {
    try {
        fs.statSync('/.dockerenv');
        return true;
    } catch {
        return false;
    }
}

function hasDockerCGroup(): boolean {
    try {
        return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
    } catch {
        return false;
    }
}

function isDocker(): boolean {
    return hasDockerEnv() || hasDockerCGroup();

}
