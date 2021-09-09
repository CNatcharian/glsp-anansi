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

/**
 * Name constants of the glsp and sprotty git repositories
 */
export module Repository {
    export const GLSP_CLIENT = 'glsp-client';
    export const GLSP_THEIA_INTEGRATION = 'glsp-theia-integration';
    export const GLSP_VSCODE_INTEGRATION = 'glsp-vscode-integration';
    export const GLSP_ECLIPSE_INTEGRATION = 'glsp-eclispe-integration';

    export const SPROTTY = 'sprotty';
    export const SPROTTY_THEIA = 'sprotty-theia';
}

/**
 * Name constants of the glsp and sprotty npm packages
 */
export module Package {
    export const GLSP_CLIENT = '@eclipse-glsp/glsp-client';
    export const GLSP_PROTOCOL = '@eclipse-glsp/glsp-protocol';
    export const GLSP_THEIA_INTEGRATION = '@eclipse-glsp/theia-integration';

    export const WORKFLOW_GLSP = '@eclipse-glsp-examples/workflow-glsp';
    export const WORKFLOW_THEIA = '@eclipse-glsp-examples/workflow-theia';

    export const SPROTTY = 'sprotty';
    export const SPROTTY_THEIA = 'sprotty-theia';
}

export class ProjectSet {
    static readonly CLIENT = new ProjectSet('CLIENT', [Repository.GLSP_CLIENT]);
    static readonly THEIA = new ProjectSet('THEIA', [Repository.GLSP_CLIENT, Repository.GLSP_THEIA_INTEGRATION]);
    static readonly VSCODE = new ProjectSet('VSCODE', [Repository.GLSP_VSCODE_INTEGRATION, Repository.GLSP_CLIENT]);
    static readonly ECLIPSE = new ProjectSet('ECLIPSE', [Repository.GLSP_ECLIPSE_INTEGRATION, Repository.GLSP_CLIENT]);
    static readonly ALL = new ProjectSet('ALL', [Repository.GLSP_CLIENT, Repository.GLSP_THEIA_INTEGRATION, Repository.GLSP_VSCODE_INTEGRATION, Repository.GLSP_THEIA_INTEGRATION]);

    static getAll(): ProjectSet[] {
        return [ProjectSet.CLIENT, ProjectSet.THEIA, ProjectSet.VSCODE, ProjectSet.ECLIPSE, ProjectSet.ALL];
    }

    static getKeys(): string[] {
        return ProjectSet.getAll().map(set => set.key);
    }

    static getValues(): string[][] {
        return ProjectSet.getAll().map(set => set.value);
    }

    static create(key: string): ProjectSet | undefined {
        const matches = this.getAll().filter(set => set.key === key.toUpperCase());
        if (matches.length === 1) {
            return matches[0];
        }
        return undefined;
    }

    private constructor(private _key: string, private _value: string[]) {

    }

    get value(): string[] {
        return this._value;
    }

    get key(): string {
        return this._key;
    }

}
