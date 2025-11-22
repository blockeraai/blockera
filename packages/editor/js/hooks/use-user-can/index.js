// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export function useUserCan(kind: string, name: string): boolean {
	return useSelect(
		(select) => {
			let recordId;

			switch (name) {
				case 'globalStyles':
					recordId =
						select(
							coreStore
						).__experimentalGetCurrentGlobalStylesId();
					break;
				default:
					recordId = null;
					break;
			}

			return select(coreStore).canUserEditEntityRecord(
				kind,
				name,
				recordId
			);
		},
		[kind, name]
	);
}
