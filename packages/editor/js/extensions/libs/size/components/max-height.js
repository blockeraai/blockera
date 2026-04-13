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

type TMaxHeightProps = {
	block: Object,
	extensionConfig: Object,
	values: Object,
	attributes: Object,
	extensionProps: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	isActive: boolean,
	isNested?: boolean,
	showMinHeight?: boolean,
};

export const MaxHeight: ComponentType<TMaxHeightProps> = ({
	block,
	extensionConfig,
	values,
	attributes,
	extensionProps,
	handleOnChangeAttributes,
	isActive,
	isNested = false,
	showMinHeight = false,
}: TMaxHeightProps): MixedElement => {
	if (!isActive) {
		return <></>;
	}

	// Determine columns value based on nested state and min height visibility
	let columns;
	if (isNested && showMinHeight) {
		columns = 'columns-1';
	} else if (isNested) {
		columns = '1.75fr 2fr';
	} else {
		columns = '1fr 2.5fr';
	}

	return (
		<EditorFeatureWrapper
			isActive={isActive}
			config={extensionConfig.blockeraMaxHeight}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'maxHeight'),
					value: values.blockeraMaxHeight,
					attribute: 'blockeraMaxHeight',
					blockName: block.blockName,
				}}
			>
				<InputControl
					label={__('Max Height', 'blockera')}
					labelPopoverTitle={__('Max Height', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									"Max-height restricts the maximum height of block, ensuring it doesn't exceed a specified height, crucial for maintaining design coherence.",
									'blockera'
								)}
							</p>
							<p>
								{__(
									'This feature is essential in responsive design, preventing block from stretching too taller on larger screens, thus preserving readability and layout aesthetics.',
									'blockera'
								)}
							</p>
						</>
					}
					aria-label={__('Max Height', 'blockera')}
					columns={columns}
					className={
						isNested && showMinHeight
							? 'control-first label-center small-gap'
							: undefined
					}
					placeholder="Auto"
					unitType="max-height"
					min={0}
					size={isNested ? 'small' : undefined}
					defaultValue={attributes.blockeraMaxHeight.default}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes(
							'blockeraMaxHeight',
							newValue,
							{ ref }
						)
					}
					controlAddonTypes={['variable']}
					variableTypes={['width-size', 'spacing']}
					{...extensionProps.blockeraMaxHeight}
				/>
			</ControlContextProvider>
		</EditorFeatureWrapper>
	);
};
