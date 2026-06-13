// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { BoxBorderControl, ControlContextProvider } from '@blockera/controls';
import type { TValueTypes } from '@blockera/controls/js/libs/box-border-control/types';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { THandleOnChangeAttributes } from '../../types';

export const BORDER_PRESET_ATTRIBUTE = 'blockeraBorder';
export const BORDER_COLOR_PRESET_PREVIEW_USAGE = 'border-color';
export const BORDER_PRESET_PREVIEW_USAGE_ALL = 'all';
export const BORDER_PRESET_PREVIEW_USAGE_TOP = 'top';
export const BORDER_PRESET_PREVIEW_USAGE_RIGHT = 'right';
export const BORDER_PRESET_PREVIEW_USAGE_BOTTOM = 'bottom';
export const BORDER_PRESET_PREVIEW_USAGE_LEFT = 'left';

export const BORDER_PRESET_PREVIEW_USAGES = [
	BORDER_PRESET_PREVIEW_USAGE_ALL,
	BORDER_PRESET_PREVIEW_USAGE_TOP,
	BORDER_PRESET_PREVIEW_USAGE_RIGHT,
	BORDER_PRESET_PREVIEW_USAGE_BOTTOM,
	BORDER_PRESET_PREVIEW_USAGE_LEFT,
];

export const Border = ({
	block,
	border,
	onChange,
	defaultValue,
	...props
}: {
	block: Object,
	border?: Object,
	onChange: THandleOnChangeAttributes,
	defaultValue: TValueTypes,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'border'),
				value: border,
				attribute: BORDER_PRESET_ATTRIBUTE,
				blockName: block.blockName,
			}}
		>
			<BoxBorderControl
				columns="columns-1"
				label={__('Border', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'Define clear boundaries for blocks with customizable lines, enhancing structure and design.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'Solid borders offer a classic, defined look, while dotted or dashed styles can create a more playful visual effect.',
								'blockera'
							)}
						</p>
					</>
				}
				onChange={(newValue: Object, ref?: Object): void => {
					onChange('blockeraBorder', newValue, { ref });
				}}
				defaultValue={defaultValue}
				{...props}
			/>
		</ControlContextProvider>
	);
};
