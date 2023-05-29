/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { reset } from '@wordpress/icons';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../context';
import VisibleElement from './visible-element';
import { Button } from '@publisher/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

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
			<VisibleElement {...{ setVisibility, isVisible }} />

			<Button
				className={controlInnerClassNames('btn-delete')}
				icon={reset}
				showTooltip={true}
				onClick={() => removeItem(itemId)}
				label={__('Delete', 'publisher')}
			/>

			{/* {!isPopover && ( */}
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
			{/* )} */}
		</>
	);
}
