// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Popover } from '@publisher/components';

/**
 * Internal dependencies
 */
import { More } from './icons';
import { Supports } from './components';

export const ExtensionSettings = ({
	buttonLabel = __('More Settings', 'publisher-core'),
	title = __('Settings', 'publisher-core'),
	features,
	update = () => {},
}: {
	title?: string | MixedElement,
	buttonLabel?: string | MixedElement,
	features: Object,
	update: (settings: Object) => void,
}): MixedElement => {
	const [isOpen, setIsOpen] = useState(false);

	const defaults: { [key: string]: Object } = {};
	const tools: { [key: string]: Object } = {};

	Object.keys(features).forEach((featureId: string): void => {
		// hide items
		if (
			features[featureId]?.showInSettings !== undefined &&
			!features[featureId]?.showInSettings
		) {
			return;
		}

		if (features[featureId].force) {
			defaults[featureId] = features[featureId];
			return;
		}

		tools[featureId] = features[featureId];
	});

	const hasItems = (stack: Object): boolean =>
		0 !== Object.values(stack).length;

	return (
		<>
			<More
				label={buttonLabel}
				onClick={(): void => setIsOpen(!isOpen)}
				isOpen={isOpen}
			/>

			{isOpen && (
				<Popover
					offset={20}
					title={title}
					placement={'left-start'}
					closeButton={true}
					className={'extension-settings'}
					onClose={() => setIsOpen(false)}
					focusOnMount={true}
				>
					{hasItems(defaults) && (
						<div className={'settings-category'}>
							<span className={'settings-category__title'}>
								{__('Essential Features', 'publisher-core')}
							</span>

							<Supports
								update={update}
								supports={defaults}
								allFeatures={features}
							/>
						</div>
					)}

					{hasItems(tools) && (
						<div className={'settings-category'}>
							<span className={'settings-category__title'}>
								{hasItems(defaults)
									? __(
											'Additional Features',
											'publisher-core'
									  )
									: __('Features', 'publisher-core')}
							</span>

							<Supports
								update={update}
								supports={tools}
								allFeatures={features}
							/>
						</div>
					)}
				</Popover>
			)}
		</>
	);
};
