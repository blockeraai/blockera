// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Icon, Button } from '@publisher/components';
import { componentClassNames } from '@publisher/classnames';

export const SupportItem = ({
	name,
	update,
	setting,
	supports,
}: {
	name: string,
	setting: Object,
	supports: Object,
	update: (setting: Object) => void,
}): MixedElement => {
	const { label, status, show, force } = setting;

	if (!status) {
		return <></>;
	}

	const onClick = () => {
		if (force) {
			return;
		}

		update({
			...supports,
			[name]: {
				...supports[name],
				show: !show,
			},
		});
	};

	let ariaLabel = '';

	if (force) {
		ariaLabel = // translators: %s is the feature name in advanced settings panel in extensions
			sprintf(__('%s is a required feature', 'publisher-core'), label);
	} else {
		ariaLabel = show
			? // translators: %s is the feature name in advanced settings panel in extensions
			  sprintf(__('Deactivate %s', 'publisher-core'), label)
			: // translators: %s is the feature name in advanced settings panel in extensions
			  sprintf(__('Activate %s', 'publisher-core'), label);
	}

	return (
		<Button
			showTooltip={true}
			label={ariaLabel}
			onClick={onClick}
			onKeyDown={(event) => {
				if (event.key === 'Enter') {
					onClick();
				}
			}}
			className={componentClassNames('support-item', {
				'force-item': force,
				'active-item': show,
			})}
			{...(!force ? { tabIndex: 1 } : {})}
		>
			{label}
			{(force || show) && <Icon library={'wp'} icon={'check'} />}
		</Button>
	);
};
