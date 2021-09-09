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
import download from 'mvn-artifact-download';

import { Logger } from './common/logging';

const mavenRepository = 'https://oss.sonatype.org/content/repositories/snapshots/';
const groupId = 'org.eclipse.glsp.example';
const artifactId = 'org.eclipse.glsp.example.workflow';
const classifier = 'glsp';

export function executeDownloadServer(downloadDir: string, version: string, isSnapShot = false, debugOutput = false): void {
    const log = new Logger(debugOutput);
    const fullVersion = `${version}${isSnapShot ? '-SNAPSHOT' : ''}`;

    log.debug(`Start download with the following parameters:
    
    group: '${groupId}',
    artifact: '${artifactId}',
    version: '${fullVersion}',
    classifier: '${classifier}',
    repository: '${mavenRepository}',
    downloadDirectory: '${downloadDir}'
    
    `);

    log.info(`Downloading version '${fullVersion} of the Workflow Example Java Server from the maven repository...`);
    download({ groupId, artifactId, version, classifier, isSnapShot }, downloadDir, mavenRepository)
        .then(() => console.log('Download completed'))
        .catch(err => log.error(err));

}

