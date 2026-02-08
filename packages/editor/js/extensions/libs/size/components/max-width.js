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

type TMaxWidthProps = {
	block: Object,
	extensionConfig: Object,
	values: Object,
	attributes: Object,
	extensionProps: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	isActive: boolean,
	isNested?: boolean,
	showMinWidth?: boolean,
};

export const MaxWidth: ComponentType<TMaxWidthProps> = ({
	block,
	extensionConfig,
	values,
	attributes,
	extensionProps,
	handleOnChangeAttributes,
	isActive,
	isNested = false,
	showMinWidth = false,
}: TMaxWidthProps): MixedElement => {
	if (!isActive) {
		return <></>;
	}

	let columns = '1fr 2.5fr';
	if (isNested && showMinWidth) {
		columns = 'columns-1';
	} else if (isNested) {
		columns = '1.75fr 2fr';
	}

	return (
		<EditorFeatureWrapper
			isActive={isActive}
			config={extensionConfig.blockeraMaxWidth}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'maxWidth'),
					value: values.blockeraMaxWidth,
					attribute: 'blockeraMaxWidth',
					blockName: block.blockName,
				}}
			>
				<InputControl
					label={__('Max Width', 'blockera')}
					labelPopoverTitle={__('Max Width', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									"Max-Width restricts the maximum width of block, ensuring it doesn't exceed a specified width, crucial for maintaining design coherence.",
									'blockera'
								)}
							</p>
							<p>
								{__(
									'This feature is essential in responsive design, preventing block from stretching too wide on larger screens, thus preserving readability and layout aesthetics.',
									'blockera'
								)}
							</p>
						</>
					}
					aria-label={__('Max Width', 'blockera')}
					columns={columns}
					className={
						isNested && showMinWidth
							? 'control-first label-center small-gap'
							: undefined
					}
					placeholder="Auto"
					unitType="max-width"
					min={0}
					size={isNested ? 'small' : undefined}
					defaultValue={attributes.blockeraMaxWidth.default}
					onChange={(newValue, ref) =>
						handleOnChangeAttributes('blockeraMaxWidth', newValue, {
							ref,
						})
					}
					controlAddonTypes={['variable']}
					variableTypes={['width-size', 'spacing']}
					{...extensionProps.blockeraMaxWidth}
				/>
			</ControlContextProvider>
		</EditorFeatureWrapper>
	);
};
