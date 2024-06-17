// @flow

/**
 * Blockera dependencies
 */
import { prepare } from '@blockera/data-editor';

/**
 * Internal dependencies
 */
import jsonEnvFile from '../../../experimental.config.json';

export class DotEnv {
	path: string;

	get(supportQuery: string): any {
		throw new Error(
			`Must override method get(supportQuery: string) with recieved ${supportQuery} param.`
		);
	}
}

export type EnvConfig = { path: string };

type ExperimentalType = {
	...Object,
	get: (supportQuery: string) => any,
};

export class ExperimentalEnv extends DotEnv {
	get(supportQuery: string): any {
		return prepare(supportQuery, jsonEnvFile);
	}
}

export const experimental = (): ExperimentalType => new ExperimentalEnv();
