// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import { InputControl, ControlContextProvider } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { EditorFeatureWrapper } from '../../../../';
import { generateExtensionId } from '../../utils';
import type { THandleOnChangeAttributes } from '../../types';

type THeightProps = {
	block: Object,
	extensionConfig: Object,
	values: Object,
	attributes: Object,
	extensionProps: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	isActive: boolean,
	showMinMax?: boolean,
	children?: MixedElement | null,
	className?: string,
};

export const Height: ComponentType<THeightProps> = ({
	block,
	extensionConfig,
	values,
	attributes,
	extensionProps,
	handleOnChangeAttributes,
	isActive,
	showMinMax = false,
	children,
	className,
}: THeightProps): MixedElement => {
	if (!isActive) {
		return <></>;
	}

	return (
		<EditorFeatureWrapper
			isActive={isActive}
			config={extensionConfig.blockeraHeight}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'height'),
					value: values.blockeraHeight,
					attribute: 'blockeraHeight',
					blockName: block.blockName,
				}}
			>
				<InputControl
					label={__('Height', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Provides the ability to define the vertical space of the block, crucial for layout precision and design consistency.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'This feature is key for achieving uniformity and balance in your layout, especially useful for aligning blocks vertically and creating cohesive visual structures.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="1fr 2.5fr"
					placeholder="Auto"
					unitType="height"
					min={0}
					defaultValue={attributes.blockeraHeight.default}
					onChange={(newValue, ref) => {
						handleOnChangeAttributes('blockeraHeight', newValue, {
							ref,
						});
					}}
					controlAddonTypes={['variable']}
					variableTypes={['width-size', 'spacing']}
					className={className}
					{...extensionProps.blockeraHeight}
				>
					{showMinMax ? children : null}
				</InputControl>
			</ControlContextProvider>
		</EditorFeatureWrapper>
	);
};
