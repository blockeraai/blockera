/**
 * External dependencies
 */
import { Slot } from '@wordpress/components';
import { useEffect, memo, useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { prependPortal } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { BlockDropdownAllMenu } from './block-dropdown-all-menu';

const Delayed = ({ children, waitBeforeShow = 500 }) => {
	const [isShown, setIsShown] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsShown(true);
		}, waitBeforeShow);

		return () => clearTimeout(timeoutId);
	}, [waitBeforeShow]);

	return isShown ? children : null;
};

export const BlockPartials = memo(({ clientId, isActive, setActive }) => {
	const [isPortalVisible, setPortalVisible] = useState(false);

	const handleStyleTabOnClick = () => setPortalVisible(!isPortalVisible);

	useEffect(() => {
		const blockCard = document.querySelector('.block-editor-block-card');

		if (blockCard) {
			blockCard.style.display = 'none';
		}

		const blockVariations = document.querySelector(
			'.block-editor-block-inspector > .block-editor-block-variation-transforms'
		);

		if (blockVariations) {
			blockVariations.style.display = 'none';
		}

		const styleTab = document.querySelector(
			'.block-editor-block-inspector .block-editor-block-inspector__tabs div:first-child button:last-child'
		);

		if (styleTab) {
			styleTab.addEventListener('click', handleStyleTabOnClick);

			return () => {
				styleTab.removeEventListener('click', handleStyleTabOnClick);
			};
		}
		// eslint-disable-next-line
	}, []);

	return (
		<>
			{!isPortalVisible &&
				prependPortal(
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

			{isPortalVisible && (
				<Delayed>
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
				</Delayed>
			)}
		</>
	);
});
