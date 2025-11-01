// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Popover } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { More, Supports } from './components';

export const ExtensionSettings = ({
	buttonLabel = __('More Settings', 'blockera'),
	title = __('Settings', 'blockera'),
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
		0 !== Object.keys(stack).filter((key) => key !== 'initialOpen').length;

	if (!hasItems(tools)) {
		return <></>;
	}

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
					style={{ '--popover-height': 'auto' }}
				>
					<div className={'settings-category'}>
						<span className={'settings-category__title'}>
							{hasItems(defaults)
								? __('Additional Features', 'blockera')
								: __('Features', 'blockera')}
						</span>

						<div className={'settings-category__items'}>
							<Supports
								update={update}
								supports={tools}
								allFeatures={features}
							/>
						</div>
					</div>

					{hasItems(defaults) && (
						<div className={'settings-category'}>
							<span className={'settings-category__title'}>
								{__('Essential Features', 'blockera')}
							</span>

							<div className={'settings-category__items'}>
								<Supports
									update={update}
									supports={defaults}
									allFeatures={features}
								/>
							</div>
						</div>
					)}
				</Popover>
			)}
		</>
	);
};
