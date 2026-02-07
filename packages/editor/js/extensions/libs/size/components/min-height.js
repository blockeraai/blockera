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

type TMinHeightProps = {
	block: Object,
	extensionConfig: Object,
	values: Object,
	attributes: Object,
	extensionProps: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	isActive: boolean,
	isNested?: boolean,
	showMaxHeight?: boolean,
};

export const MinHeight: ComponentType<TMinHeightProps> = ({
	block,
	extensionConfig,
	values,
	attributes,
	extensionProps,
	handleOnChangeAttributes,
	isActive,
	isNested = false,
	showMaxHeight = false,
}: TMinHeightProps): MixedElement => {
	if (!isActive) {
		return <></>;
	}

	let columns = '1fr 2.5fr';
	if (isNested && showMaxHeight) {
		columns = 'columns-1';
	} else if (isNested) {
		columns = '1.75fr 2fr';
	}

	return (
		<EditorFeatureWrapper
			isActive={isActive}
			config={extensionConfig.blockeraMinHeight}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'minHeight'),
					value: values.blockeraMinHeight,
					attribute: 'blockeraMinHeight',
					blockName: block.blockName,
				}}
			>
				<InputControl
					defaultValue={attributes.blockeraMinHeight.default}
					label={__('Min Height', 'blockera')}
					labelPopoverTitle={__('Min Height', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									"Min-Height ensures block don't shrink below a set value, crucial for maintaining content integrity and layout consistency on smaller screens.",
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Ideal for preventing layout breakage on mobile devices, this feature helps in creating responsive designs that adapt while retaining legibility and structure.',
									'blockera'
								)}
							</p>
						</>
					}
					aria-label={__('Min Height', 'blockera')}
					columns={columns}
					className={
						isNested && showMaxHeight
							? 'control-first label-center small-gap'
							: undefined
					}
					placeholder="Auto"
					unitType="min-height"
					min={0}
					size={isNested ? 'small' : undefined}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes(
							'blockeraMinHeight',
							newValue,
							{ ref }
						)
					}
					controlAddonTypes={['variable']}
					variableTypes={['width-size', 'spacing']}
					{...extensionProps.blockeraMinHeight}
				/>
			</ControlContextProvider>
		</EditorFeatureWrapper>
	);
};
