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

	return (
		<div
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
		</div>
	);
};
