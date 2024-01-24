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
	defaults,
	tools,
	update = () => {},
	title = __('Settings', 'publisher-core'),
}: {
	title: string,
	defaults: Object,
	tools: Object,
	update: (settings: Object) => void,
}): MixedElement => {
	const [isOpen, setIsOpen] = useState(false);

	if (!isOpen) {
		return <More onClick={(): void => setIsOpen(true)} isOpen={isOpen} />;
	}

	const hasItems = (stack: Object): boolean =>
		0 !== Object.values(stack).length;

	return (
		<>
			<More onClick={(): void => setIsOpen(false)} isOpen={isOpen} />
			<Popover
				offset={20}
				title={title}
				placement={'left-start'}
				closeButton={false}
				className={'extension-settings'}
				onClose={() => setIsOpen(false)}
			>
				<div className={'extension-settings-wrapper'}>
					{hasItems(defaults) && (
						<div className={'settings-supports-cat'}>
							<span className={'title'}>
								{__('Default', 'publisher-core')}
							</span>
							<Supports update={update} supports={defaults} />
						</div>
					)}
					{hasItems(tools) && (
						<div className={'settings-supports-cat'}>
							<span className={'title'}>
								{__('Tools', 'publisher-core')}
							</span>
							<Supports update={update} supports={tools} />
						</div>
					)}
				</div>
			</Popover>
		</>
	);
};
