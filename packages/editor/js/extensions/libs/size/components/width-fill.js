// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

export const WidthFill: ComponentType<{
	blockeraWidth: string | Object,
	handleOnChangeAttributes: (
		attribute: string,
		value: string | Object,
		ref: Object
	) => void,
}> = ({ blockeraWidth, handleOnChangeAttributes }): MixedElement => {
	return (
		<span
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
	);
};
