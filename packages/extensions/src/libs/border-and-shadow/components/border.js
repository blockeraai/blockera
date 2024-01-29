// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	BoxBorderControl,
	ControlContextProvider,
	type BorderRadiusValue,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { THandleOnChangeAttributes } from '../../types';

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
	defaultValue: {
		color?: string,
		style?: string,
		width?: string,
		top?: Object,
		left?: Object,
		right?: Object,
		bottom?: Object,
		radius?: BorderRadiusValue,
	},
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'border'),
				value: border,
				attribute: 'publisherBorder',
				blockName: block.blockName,
			}}
		>
			<BoxBorderControl
				columns="columns-1"
				label={__('Border Line', 'publisher-core')}
				labelDescription={
					<>
						<p>
							{__(
								'Define clear boundaries for blocks with customizable lines, enhancing structure and design.',
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'Solid borders offer a classic, defined look, while dotted or dashed styles can create a more playful visual effect.',
								'publisher-core'
							)}
						</p>
					</>
				}
				onChange={(newValue: Object, ref?: Object): void => {
					onChange('publisherBorder', newValue, { ref });
				}}
				defaultValue={defaultValue}
				{...props}
			/>
		</ControlContextProvider>
	);
};
