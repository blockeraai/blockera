/**
 * External dependencies
 */
import { Slot } from '@wordpress/components';
import { useEffect, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { prependPortal } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { BlockDropdownAllMenu } from './block-dropdown-all-menu';

export const BlockPartials = memo(({ clientId, isActive, setActive }) => {
	const stylesTab = document.querySelector('[aria-label="Styles"]');
	const blockCard = document.querySelector('.block-editor-block-card');
	const blockVariations = document.querySelector(
		'.block-editor-block-inspector > .block-editor-block-variation-transforms'
	);

	useEffect(() => {
		if (blockCard) {
			blockCard.style.display = 'none';
		}

		if (blockVariations) {
			blockVariations.style.display = 'none';
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (!stylesTab) {
			return;
		}

		const listener = () => {
			if (blockCard) {
				blockCard.style.display = 'flex';
			}
		};

		stylesTab.addEventListener('click', listener);

		return () => stylesTab.removeEventListener('click', listener);
	}, []);

	return prependPortal(
		<>
			<div className="blockera-block-card-wrapper">
				<div className={'blockera-dropdown-menu'}>
					<BlockDropdownAllMenu
						{...{
							isActive,
							setActive,
						}}
					/>
				</div>

				<Slot name={`blockera-block-card-content-${clientId}`} />
			</div>
			<div className="blockera-block-edit-wrapper">
				<Slot name={`blockera-block-edit-content-${clientId}`} />
			</div>
		</>,
		document.querySelector('.block-editor-block-inspector')
	);
});
