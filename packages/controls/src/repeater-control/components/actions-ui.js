/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { close } from '@wordpress/icons';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Button } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../context';
import VisibleElement from './visible-element';

export default function ActionsUI({
	itemId,
	isOpen,
	setOpen,
	isVisible,
	setVisibility,
}) {
	const { removeItem, isPopover } = useContext(RepeaterContext);

	return (
		<>
			{!isPopover && (
				<Button
					className={controlInnerClassNames('btn-toggle')}
					icon={isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2'}
					label={
						isOpen
							? __('Close Settings', 'publisher')
							: __('Open Settings', 'publisher')
					}
					showTooltip={true}
					onClick={() => setOpen(!isOpen)}
				/>
			)}

			<div className={controlInnerClassNames('action-btns')}>
				<VisibleElement {...{ setVisibility, isVisible }} />
				<Button
					className={controlInnerClassNames('btn-delete')}
					icon={close}
					showTooltip={true}
					onClick={() => removeItem(itemId)}
					label={__('Delete', 'publisher')}
				/>
			</div>
		</>
	);
}
