/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { default as Search } from './search';
import { default as IconLibraries } from './icon-libraries';

export default function IconPickerPopover({
	libraries,
	search = true,
	isOpen,
	onClose = () => {},
}) {
	return (
		<>
			{isOpen && (
				<Popover
					title={__('Icon Picker', 'publisher-core')}
					offset={35}
					placement="left-start"
					className={controlInnerClassNames('icon-popover')}
					onClose={onClose}
				>
					<div
						className={controlInnerClassNames('icon-popover-body')}
					>
						{search && <Search />}

						<IconLibraries libraries={libraries} />
					</div>
				</Popover>
			)}
		</>
	);
}
