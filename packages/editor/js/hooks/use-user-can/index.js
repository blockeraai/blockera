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

			// WP 6.7+: canUserEditEntityRecord is deprecated in favor of canUser + entity resource.
			return select(coreStore).canUser('update', {
				kind,
				name,
				id: recordId,
			});
		},
		[kind, name]
	);
}
