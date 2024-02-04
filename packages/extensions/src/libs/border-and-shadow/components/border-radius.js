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
	BaseControl,
	BorderRadiusControl,
	ControlContextProvider,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../../utils';
import type { THandleOnChangeAttributes } from '../../types';

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
				attribute: 'publisherBorderRadius',
				blockName: block.blockName,
			}}
		>
			<BaseControl columns="columns-1" controlName="border-radius">
				<BorderRadiusControl
					label={__('Radius', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Softens the edges of block by rounding corners.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'Sharp borders offer a modern, structured look, while soft, rounded corners create a friendly and inviting feel',
									'publisher-core'
								)}
							</p>
						</>
					}
					onChange={(newValue: Object, ref?: Object): void =>
						onChange('publisherBorderRadius', newValue, { ref })
					}
					defaultValue={defaultValue}
					{...props}
				/>
			</BaseControl>
		</ControlContextProvider>
	);
};
