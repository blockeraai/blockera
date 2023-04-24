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
import { Button } from '@publisher/components';

export default function ActionsUI({ itemId, setOpen, isOpen }) {
	const { removeItem } = useContext(RepeaterContext);

	return (
		<>
			<Button
				icon={reset}
				showTooltip={true}
				onClick={() => removeItem(itemId)}
				label={__('Delete', 'publisher')}
			/>

			<Button
				icon={isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2'}
				label={
					isOpen
						? __('Close Settings', 'publisher')
						: __('Open Settings', 'publisher')
				}
				showTooltip={true}
				onClick={() => setOpen(!isOpen)}
			/>
		</>
	);
}
