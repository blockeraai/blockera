/**
 * External dependencies
 */
import { Slot } from '@wordpress/components';
import { useEffect, memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { prependPortal } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { BlockDropdownAllMenu } from './block-dropdown-all-menu';

export const BlockPartials = memo(({ clientId, isActive, setActive }) => {
	useEffect(() => {
		document.querySelector('.block-editor-block-card')?.remove();

		document
			.querySelector(
				'.block-editor-block-inspector > .block-editor-block-variation-transforms'
			)
			?.remove();
	}, []);

	return (
		<>
			{prependPortal(
				<>
					<div className="publisher-block-card-wrapper">
						<div className={'publisher-dropdown-menu'}>
							<BlockDropdownAllMenu
								{...{
									isActive,
									setActive,
								}}
							/>
						</div>

						<Slot
							name={`publisher-block-card-content-${clientId}`}
						/>
					</div>
					<div className="publisher-block-edit-wrapper">
						<Slot
							name={`publisher-block-edit-content-${clientId}`}
						/>
					</div>
				</>,
				document.querySelector('.block-editor-block-inspector')
			)}
		</>
	);
});
