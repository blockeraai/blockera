// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	isValid,
	InputControl,
	ControlContextProvider,
} from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { EditorFeatureWrapper } from '../../../../';
import { DIMENSION_VARIABLE_TYPES } from '../compatibility/dimension-variable-from-wp';
import { generateExtensionId } from '../../utils';
import { WidthFill } from './width-fill';
import type { THandleOnChangeAttributes } from '../../types';

type TWidthProps = {
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

export const Width: ComponentType<TWidthProps> = ({
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
}: TWidthProps): MixedElement => {
	if (!isActive) {
		return <></>;
	}

	return (
		<EditorFeatureWrapper
			isActive={isActive}
			config={extensionConfig.blockeraWidth}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'width'),
					value: values?.blockeraWidth,
					attribute: 'blockeraWidth',
					blockName: block.blockName,
				}}
			>
				<InputControl
					label={__('Width', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Provides the ability to define the horizontal space of the block, crucial for layout precision and design consistency.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Ideal for responsive design, it ensures block adapt smoothly to different screen sizes, enhancing user experience and interface scalability.',
									'blockera'
								)}
							</p>
						</>
					}
					aria-label={__('Input Width', 'blockera')}
					columns="1fr 2.5fr"
					placeholder="Auto"
					unitType="width"
					min={0}
					defaultValue={attributes.blockeraWidth.default}
					onChange={(newValue, ref) => {
						handleOnChangeAttributes('blockeraWidth', newValue, {
							ref,
						});
					}}
					controlAddonTypes={['variable']}
					variableTypes={DIMENSION_VARIABLE_TYPES}
					className={controlInnerClassNames('width-input', className)}
					{...extensionProps.blockeraWidth}
				>
					{!isValid(values?.blockeraWidth) && (
						<WidthFill
							blockeraWidth={values?.blockeraWidth}
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>
					)}
					{showMinMax ? children : null}
				</InputControl>
			</ControlContextProvider>
		</EditorFeatureWrapper>
	);
};
