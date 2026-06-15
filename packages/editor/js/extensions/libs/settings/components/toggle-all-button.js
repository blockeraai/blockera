// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Button } from '@blockera/controls';

const getToggleableFeatureKeys = (tools: Object): Array<string> => {
	const keys: Array<string> = [];

	Object.keys(tools).forEach((featureId: string): void => {
		if (featureId === 'initialOpen' || featureId === 'status') {
			return;
		}

		if (tools[featureId]?.status) {
			keys.push(featureId);
		}
	});

	return keys;
};

export const ToggleAllButton = ({
	tools,
	features,
	update,
}: {
	tools: Object,
	features: Object,
	update: (settings: Object) => void,
}): MixedElement | null => {
	const toggleableKeys = getToggleableFeatureKeys(tools);

	if (0 === toggleableKeys.length) {
		return null;
	}

	const allActive = toggleableKeys.every(
		(featureId: string): boolean => true === tools[featureId]?.show
	);

	const label = allActive
		? __('Deactivate All', 'blockera')
		: __('Activate All', 'blockera');

	const onClick = (): void => {
		const nextShow = !allActive;
		const updatedFeatures = { ...features };

		toggleableKeys.forEach((featureId: string): void => {
			updatedFeatures[featureId] = {
				...features[featureId],
				show: nextShow,
			};
		});

		update(updatedFeatures);
	};

	return (
		<Button
			variant="tertiary"
			size="extra-small"
			className={'settings-category__toggle-all'}
			onClick={onClick}
			aria-label={label}
		>
			{label}
		</Button>
	);
};
