/**
 * External dependencies
 */
import { addFilter, removeFilter } from '@wordpress/hooks';
import { useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	useGlobalStylesContext,
	recreateMissingVariablePreset,
} from '@blockera/global-styles-ui';
import {
	MISSING_VARIABLE_CAN_RECREATE_FILTER,
	MISSING_VARIABLE_RECREATE_FILTER,
} from '@blockera/controls';

/**
 * Wires missing-variable recreate from value-addons into global styles persistence.
 */
export function MissingVariableRecreateBridge(): null {
	const { setUserConfig, user, canEditGlobalStyles } =
		useGlobalStylesContext();
	const canEdit = canEditGlobalStyles === true;

	useEffect(() => {
		const canRecreateFilter = () => canEdit;

		const recreateFilter = (_result, payload) => {
			if (!canEdit || !payload?.settings) {
				return { ok: false, reason: 'invalid' };
			}

			const variableType =
				payload.variableType ?? payload.settings?.type ?? '';

			return recreateMissingVariablePreset({
				variableType,
				settings: payload.settings,
				setUserConfig,
				getUserConfig: () =>
					(user as Record<string, unknown> | undefined) ?? {},
			});
		};

		addFilter(
			MISSING_VARIABLE_CAN_RECREATE_FILTER,
			'blockera/editor-missing-variable-recreate-can',
			canRecreateFilter
		);
		addFilter(
			MISSING_VARIABLE_RECREATE_FILTER,
			'blockera/editor-missing-variable-recreate',
			recreateFilter
		);

		return () => {
			removeFilter(
				MISSING_VARIABLE_CAN_RECREATE_FILTER,
				'blockera/editor-missing-variable-recreate-can'
			);
			removeFilter(
				MISSING_VARIABLE_RECREATE_FILTER,
				'blockera/editor-missing-variable-recreate'
			);
		};
	}, [canEdit, setUserConfig, user]);

	return null;
}
