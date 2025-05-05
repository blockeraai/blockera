// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getSortedObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../../../store';
import type { StateTypes, TStates } from './types';

export function unstableBootstrapServerSideBlockStatesDefinitions(definitions: {
	[key: TStates]: StateTypes,
}) {
	const { setBlockStates } = dispatch(STORE_NAME);
	const overrideDefinitions: { [key: string]: Object } = {};

	for (const [key, definition] of Object.entries(definitions)) {
		if (definition?.hasOwnProperty('native')) {
			const isNative = definition?.native;

			overrideDefinitions[key] = {
				...definition,
				disabled: isNative,
			};

			continue;
		}

		overrideDefinitions[key] = definition;
	}

	setBlockStates(getSortedObject(overrideDefinitions));
}
