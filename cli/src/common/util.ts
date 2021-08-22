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
 * Utilitiy functions to create often used yarn commands.
 */
export namespace YarnCommand {
    export const build = (force = false): string => `yarn install ${force ? '--force' : ''}`;
    export const unlink = (): string => 'yarn unlink';
    export const link = (customLinkDir?: string): string => `yarn link ${customLinkDir ? '--link-folder ' + customLinkDir : ''}`;
}

/**
 * Name constants of the repository root directories
 */
export namespace Repository {
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
export namespace Package {
    export const GLSP_CLIENT = '@eclipse-glsp/glsp-client';
    export const GLSP_PROTOCOL = '@eclipse-glsp/glsp-protocol';
    export const GLSP_THEIA_INTEGRATION = '@eclipse-glsp/theia-integration';

    export const WORKFLOW_GLSP = '@eclipse-glsp-examples/workflow-glsp';
    export const WORKFLOW_THEIA = '@eclipse-glsp-examples/workflow-theia';

    export const SPROTTY = 'sprotty';
    export const SPROTTY_THEIA = 'sprotty-theia';

}
