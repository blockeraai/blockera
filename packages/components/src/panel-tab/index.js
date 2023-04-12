/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';

export default function PanelTab({ label, onDelete, children }) {
	const [isOpen, setOpen] = useState(false);

	return (
		<div className="publisher-core-panel-tab">
			<div className="publisher-core-panel-tab__header">
				<div className="publisher-core-panel-tab__header__label">
					{label}
				</div>

				<Button
					icon={isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2'}
					label={
						isOpen
							? __('Close Settings', 'publisher-blocks')
							: __('Open Settings', 'publisher-blocks')
					}
					showTooltip={true}
					onClick={() => setOpen(!isOpen)}
				/>

				<Button
					icon="npublisher-core-alt"
					label={__('Delete', 'publisher-blocks')}
					showTooltip={true}
					onClick={onDelete}
				/>
			</div>

			{isOpen && (
				<div className="publisher-core-panel-tab__content">
					{children}
				</div>
			)}
		</div>
	);
}
