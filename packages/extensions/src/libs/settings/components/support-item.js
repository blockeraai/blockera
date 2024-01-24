// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { Icon } from '@publisher/components';
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

	return (
		<div
			key={`${name}`}
			onClick={() => {
				if (!force) {
					return;
				}

				update({
					...supports,
					[name]: {
						...supports[name],
						show: !show,
					},
				});
			}}
			className={componentClassNames('support-item', {
				'not-available': !force,
				deactivated: !show,
			})}
		>
			{label}
			{force && show && <Icon library={'wp'} icon={'check'} />}
		</div>
	);
};
