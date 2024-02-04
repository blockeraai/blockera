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
	InputControl,
	ControlContextProvider,
	NoticeControl,
	BaseControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import { generateExtensionId } from '../../utils';

export const Opacity = ({
	block,
	opacity,
	props,
	defaultValue,
	handleOnChangeAttributes,
}: {
	opacity: string | void,
	block: TBlockProps,
	props: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	defaultValue: string,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'opacity'),
				value: opacity,
				attribute: 'publisherOpacity',
				blockName: block.blockName,
			}}
		>
			<BaseControl columns="columns-1">
				<InputControl
					controlName="input"
					label={__('Opacity', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Opacity controls the transparency level of block, ranging from 0 (completely transparent) to 1 (fully opaque).',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									"It's widely used in animations, UI interactions, and to draw attention or de-emphasize blocks.",
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					{...props}
					unitType="percent"
					range={true}
					min={0}
					max={100}
					initialPosition={100}
					defaultValue={defaultValue}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes('publisherOpacity', newValue, {
							ref,
						})
					}
				/>

				{opacity === '0%' && (
					<NoticeControl type="warning">
						{__(
							'Your block’s opacity is set to "0", making it invisible. If you\'re wondering why it\'s not showing.',
							'publisher-core'
						)}
					</NoticeControl>
				)}
			</BaseControl>
		</ControlContextProvider>
	);
};
