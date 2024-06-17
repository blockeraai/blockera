// @flow

/**
 * External dependencies
 */
import { prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import DotEnv from './dotenv';
import type { ExperimentalType } from './types';
import experimentalConfig from '../../../experimental.config.json';

export class ExperimentalEnv extends DotEnv {
	get(supportQuery: string): any {
		return prepare(supportQuery, experimentalConfig);
	}
}

export const experimental = (): ExperimentalType => new ExperimentalEnv();
