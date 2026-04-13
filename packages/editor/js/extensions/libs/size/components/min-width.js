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

type TMinWidthProps = {
	block: Object,
	extensionConfig: Object,
	values: Object,
	attributes: Object,
	extensionProps: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	isActive: boolean,
	isNested?: boolean,
	showMaxWidth?: boolean,
};

export const MinWidth: ComponentType<TMinWidthProps> = ({
	block,
	extensionConfig,
	values,
	attributes,
	extensionProps,
	handleOnChangeAttributes,
	isActive,
	isNested = false,
	showMaxWidth = false,
}: TMinWidthProps): MixedElement => {
	if (!isActive) {
		return <></>;
	}

	let columns = '1fr 2.5fr';
	if (isNested && showMaxWidth) {
		columns = 'columns-1';
	} else if (isNested) {
		columns = '1.75fr 2fr';
	}

	return (
		<EditorFeatureWrapper
			isActive={isActive}
			config={extensionConfig.blockeraMinWidth}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'minWidth'),
					value: values.blockeraMinWidth,
					attribute: 'blockeraMinWidth',
					blockName: block.blockName,
				}}
			>
				<InputControl
					label={__('Min Width', 'blockera')}
					labelPopoverTitle={__('Min Width', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									"Min-Width ensures block don't shrink below a set value, crucial for maintaining content integrity and layout consistency on smaller screens.",
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
					aria-label={__('Min Width', 'blockera')}
					columns={columns}
					className={
						isNested && showMaxWidth
							? 'control-first label-center small-gap'
							: undefined
					}
					placeholder="Auto"
					unitType="min-width"
					min={0}
					size={isNested ? 'small' : undefined}
					defaultValue={attributes.blockeraMinWidth.default}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes('blockeraMinWidth', newValue, {
							ref,
						})
					}
					controlAddonTypes={['variable']}
					variableTypes={['width-size', 'spacing']}
					{...extensionProps.blockeraMinWidth}
				/>
			</ControlContextProvider>
		</EditorFeatureWrapper>
	);
};
