/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { reset } from '@wordpress/icons';
import { Button } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import { getBaseClassNames } from '../global-helpers';

export default function PanelTab({
	label,
	isOpen,
	setOpen,
	onDelete,
	children,
	className,
}) {
	return (
		<div
			className={classnames(getBaseClassNames(), 'panel-tab', className)}
		>
			<div className="header">
				<div className="header-label">{label}</div>

				<Button
					icon={reset}
					label={__('Delete', 'publisher-blocks')}
					showTooltip={true}
					onClick={onDelete}
				/>

				<Button
					icon={isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2'}
					label={
						isOpen
							? __('Close Settings', 'publisher-blocks')
							: __('Open Settings', 'publisher-blocks')
					}
					showTooltip={true}
					onClick={setOpen}
				/>
			</div>

			{isOpen && <div className="content">{children}</div>}
		</div>
	);
}
