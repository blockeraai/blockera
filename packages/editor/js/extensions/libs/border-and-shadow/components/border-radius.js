// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	BaseControl,
	BorderRadiusControl,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { THandleOnChangeAttributes } from '../../types';

export const BORDER_RADIUS_PRESET_ATTRIBUTE = 'blockeraBorderRadius';
export const BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL = 'all';
export const BORDER_RADIUS_PRESET_PREVIEW_USAGE_TOP_LEFT = 'topLeft';
export const BORDER_RADIUS_PRESET_PREVIEW_USAGE_TOP_RIGHT = 'topRight';
export const BORDER_RADIUS_PRESET_PREVIEW_USAGE_BOTTOM_LEFT = 'bottomLeft';
export const BORDER_RADIUS_PRESET_PREVIEW_USAGE_BOTTOM_RIGHT = 'bottomRight';

export const BORDER_RADIUS_PRESET_PREVIEW_USAGES = [
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL,
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_TOP_LEFT,
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_TOP_RIGHT,
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_BOTTOM_LEFT,
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_BOTTOM_RIGHT,
];

export const BorderRadius = ({
	block,
	borderRadius,
	defaultValue,
	onChange,
	...props
}: {
	block: Object,
	borderRadius?: Object,
	onChange: THandleOnChangeAttributes,
	defaultValue: Object,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'border-radius'),
				value: borderRadius,
				attribute: BORDER_RADIUS_PRESET_ATTRIBUTE,
				blockName: block.blockName,
			}}
		>
			<BaseControl columns="columns-1" controlName="border-radius">
				<BorderRadiusControl
					label={__('Radius', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Softens the edges of block by rounding corners.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Sharp borders offer a modern, structured look, while soft, rounded corners create a friendly and inviting feel',
									'blockera'
								)}
							</p>
						</>
					}
					onChange={(newValue: Object, ref?: Object): void =>
						onChange('blockeraBorderRadius', newValue, { ref })
					}
					defaultValue={defaultValue}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
