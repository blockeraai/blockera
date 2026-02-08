// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useEffect,
	useRef,
	type MixedElement,
	type ComponentType,
} from 'react';

/**
 * Blockera dependencies
 */
import { Tooltip } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

export const WidthFill: ComponentType<{
	blockeraWidth: string | Object,
	handleOnChangeAttributes: (
		attribute: string,
		value: string | Object,
		ref: Object
	) => void,
}> = ({ blockeraWidth, handleOnChangeAttributes }): MixedElement => {
	const elementRef = useRef<?HTMLElement>(null);

	useEffect(() => {
		if (!elementRef.current) {
			return;
		}

		const parent = elementRef.current.parentElement;
		if (!parent) {
			return;
		}

		const updateWidth = () => {
			if (!elementRef.current || !parent) {
				return;
			}

			const width = parent.getBoundingClientRect().width;

			// Set CSS variable on the width-fill element
			if (elementRef.current) {
				elementRef.current.style.setProperty(
					'--parent-width',
					`${width}px`
				);
			}
		};

		// Initial update
		updateWidth();

		// Update on resize
		const resizeObserver = new ResizeObserver(updateWidth);
		resizeObserver.observe(parent);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<Tooltip
			text={
				<>
					<h5>{__('Fill Available Space', 'blockera')}</h5>
					<p>
						{__(
							'Fills all available space in the container. Unlike 100%, it won’t overflow or force a full-width layout when the container has limited or shared space.',
							'blockera'
						)}
					</p>
				</>
			}
			width="260px"
			style={{ '--tooltip-padding': '12px' }}
		>
			<span
				ref={elementRef}
				className={controlInnerClassNames(
					'width-fill',
					blockeraWidth === 'stretch' && 'filled'
				)}
				onClick={(e) => {
					handleOnChangeAttributes(
						'blockeraWidth',
						blockeraWidth === 'stretch' ? '' : 'stretch',
						{ ref: e.currentTarget }
					);
				}}
			>
				{__('Fill', 'blockera')}
				<span className="blockera-control-width-fill__indicator">
					<span className="blockera-control-width-fill__indicator__arrow left" />
					<span className="blockera-control-width-fill__indicator__dash" />
					<span className="blockera-control-width-fill__indicator__arrow right" />
				</span>
			</span>
		</Tooltip>
	);
};
