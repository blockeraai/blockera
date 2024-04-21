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
				attribute: 'blockeraBorderRadius',
				blockName: block.blockName,
			}}
		>
			<BaseControl columns="columns-1" controlName="border-radius">
				<BorderRadiusControl
					label={__('Radius', 'blockera-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Softens the edges of block by rounding corners.',
									'blockera-core'
								)}
							</p>
							<p>
								{__(
									'Sharp borders offer a modern, structured look, while soft, rounded corners create a friendly and inviting feel',
									'blockera-core'
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
