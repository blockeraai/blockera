// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';
import type { MixedElement, ComponentType } from 'react';

/**
 * Blockera dependencies
 */
import {
	MoreFeatures,
	BaseControl,
	InputControl,
	TextShadowControl,
	ControlContextProvider,
	ConditionalWrapper,
} from '@blockera/controls';
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../utils';
import { EditorFeatureWrapper } from '../../../';
import { usePromotedMoreFeatures } from '../../hooks/use-promoted-more-features';
import {
	countTypographyMoreFeatureSlots,
	shouldUseTypographyMoreFeatures,
} from './more-features-utils';
import {
	TextTransform,
	TextDecoration,
	LetterSpacing,
	TextColumns,
	TextStroke,
	TextDirection,
	TextOrientation,
	WordBreak,
	TextWrap,
} from './components';
import type { TTypographyProps } from './type/typography-props';

const SPACING_KEYS = [
	'blockeraLetterSpacing',
	'blockeraWordSpacing',
	'blockeraTextIndent',
];

type AdvancedFeaturesProps = {
	block: TTypographyProps['block'],
	values: TTypographyProps['values'],
	attributes: TTypographyProps['attributes'],
	extensionConfig: TTypographyProps['extensionConfig'],
	extensionProps: TTypographyProps['extensionProps'],
	display?: string,
	activeSearchMode: boolean,
	handleOnChangeAttributes: TTypographyProps['handleOnChangeAttributes'],
	isShowTextShadow: boolean,
	isShowTextTransform: boolean,
	isShowTextDecoration: boolean,
	isShowDirection: boolean,
	isShowTextOrientation: boolean,
	isShowLetterSpacing: boolean,
	isShowWordSpacing: boolean,
	isShowTextIndent: boolean,
	isShowTextColumns: boolean,
	isShowTextStroke: boolean,
	isShowTextWrap: boolean,
	isShowWordBreak: boolean,
};

function isFeatureEdited(
	key: string,
	values: TTypographyProps['values'],
	attributes: TTypographyProps['attributes']
): boolean {
	switch (key) {
		case 'blockeraTextShadow':
			return !isEquals(
				values?.blockeraTextShadow,
				attributes.blockeraTextShadow.default
			);
		case 'blockeraTextDecoration':
			return (
				values?.blockeraTextDecoration !==
				attributes.blockeraTextDecoration.default
			);
		case 'blockeraTextTransform':
			return (
				values?.blockeraTextTransform !==
				attributes.blockeraTextTransform.default
			);
		case 'blockeraDirection':
			return (
				values?.blockeraDirection !==
				attributes.blockeraDirection.default
			);
		case 'blockeraTextOrientation':
			return (
				values?.blockeraTextOrientation !==
				attributes.blockeraTextOrientation.default
			);
		case 'blockeraLetterSpacing':
			return (
				values?.blockeraLetterSpacing !==
				attributes.blockeraLetterSpacing.default
			);
		case 'blockeraWordSpacing':
			return (
				values?.blockeraWordSpacing !==
				attributes.blockeraWordSpacing.default
			);
		case 'blockeraTextIndent':
			return (
				values?.blockeraTextIndent !==
				attributes.blockeraTextIndent.default
			);
		case 'blockeraTextColumns':
			return !isEquals(
				values?.blockeraTextColumns,
				attributes.blockeraTextColumns.default
			);
		case 'blockeraTextStroke':
			return !isEquals(
				values?.blockeraTextStroke,
				attributes.blockeraTextStroke.default
			);
		case 'blockeraTextWrap':
			return (
				values?.blockeraTextWrap !== attributes.blockeraTextWrap.default
			);
		case 'blockeraWordBreak':
			return (
				values?.blockeraWordBreak !==
				attributes.blockeraWordBreak.default
			);
		default:
			return false;
	}
}

export const AdvancedTypographyFeatures: ComponentType<
	AdvancedFeaturesProps,
> = ({
	block,
	values,
	attributes,
	extensionConfig,
	extensionProps,
	display,
	activeSearchMode,
	handleOnChangeAttributes,
	isShowTextShadow,
	isShowTextTransform,
	isShowTextDecoration,
	isShowDirection,
	isShowTextOrientation,
	isShowLetterSpacing,
	isShowWordSpacing,
	isShowTextIndent,
	isShowTextColumns,
	isShowTextStroke,
	isShowTextWrap,
	isShowWordBreak,
}: AdvancedFeaturesProps): MixedElement => {
	const isSpacingVisible =
		isShowLetterSpacing || isShowWordSpacing || isShowTextIndent;

	const moreFeatureSlotCount = useMemo(
		() =>
			countTypographyMoreFeatureSlots({
				isShowTextShadow,
				isShowTextTransform,
				isShowTextDecoration,
				isShowDirection,
				isShowTextOrientation,
				isSpacingVisible,
				isShowTextColumns,
				isShowTextStroke,
				isShowTextWrap,
				isShowWordBreak,
			}),
		[
			isShowTextShadow,
			isShowTextTransform,
			isShowTextDecoration,
			isShowDirection,
			isShowTextOrientation,
			isSpacingVisible,
			isShowTextColumns,
			isShowTextStroke,
			isShowTextWrap,
			isShowWordBreak,
		]
	);

	const shouldUseMoreFeatures =
		shouldUseTypographyMoreFeatures(moreFeatureSlotCount);

	const featureCheckers = useMemo(
		() => ({
			blockeraTextShadow: () =>
				isFeatureEdited('blockeraTextShadow', values, attributes),
			blockeraTextDecoration: () =>
				isFeatureEdited('blockeraTextDecoration', values, attributes),
			blockeraTextTransform: () =>
				isFeatureEdited('blockeraTextTransform', values, attributes),
			blockeraDirection: () =>
				isFeatureEdited('blockeraDirection', values, attributes),
			blockeraTextOrientation: () =>
				isFeatureEdited('blockeraTextOrientation', values, attributes),
			blockeraLetterSpacing: () =>
				isFeatureEdited('blockeraLetterSpacing', values, attributes),
			blockeraWordSpacing: () =>
				isFeatureEdited('blockeraWordSpacing', values, attributes),
			blockeraTextIndent: () =>
				isFeatureEdited('blockeraTextIndent', values, attributes),
			blockeraTextColumns: () =>
				isFeatureEdited('blockeraTextColumns', values, attributes),
			blockeraTextStroke: () =>
				isFeatureEdited('blockeraTextStroke', values, attributes),
			blockeraTextWrap: () =>
				isFeatureEdited('blockeraTextWrap', values, attributes),
			blockeraWordBreak: () =>
				isFeatureEdited('blockeraWordBreak', values, attributes),
		}),
		[values, attributes]
	);

	const getEditedKeys = useCallback(
		() =>
			Object.keys(featureCheckers).filter((key) =>
				featureCheckers[key]()
			),
		[featureCheckers]
	);

	const {
		isPromoted,
		markTouched,
		commitPendingPromotion,
		hasPendingTouched,
	} = usePromotedMoreFeatures({
		clientId: block.clientId,
		getEditedKeys,
		enabled: shouldUseMoreFeatures,
	});

	const handleMoreFeaturesOpenChange = useCallback(
		(isOpen: boolean) => {
			if (!isOpen) {
				commitPendingPromotion();
			}
		},
		[commitPendingPromotion]
	);

	const handleAdvancedOnChange = useCallback(
		(attribute, newValue, options) => {
			if (shouldUseMoreFeatures) {
				markTouched(attribute);
			}
			handleOnChangeAttributes(attribute, newValue, options);
		},
		[markTouched, handleOnChangeAttributes, shouldUseMoreFeatures]
	);

	const isSpacingPromoted =
		isPromoted('blockeraLetterSpacing') ||
		isPromoted('blockeraWordSpacing') ||
		isPromoted('blockeraTextIndent');

	const renderTextShadow = (): MixedElement => (
		<EditorFeatureWrapper
			isActive={isShowTextShadow}
			config={extensionConfig.blockeraTextShadow}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'text-shadow'),
					value: values.blockeraTextShadow,
					attribute: 'blockeraTextShadow',
					blockName: block.blockName,
				}}
				storeName={'blockera/controls/repeater'}
			>
				<BaseControl controlName="text-shadow" columns="columns-1">
					<TextShadowControl
						label={__('Text Shadows', 'blockera')}
						onChange={(newValue, ref) =>
							handleAdvancedOnChange(
								'blockeraTextShadow',
								newValue,
								{ ref }
							)
						}
						defaultValue={attributes.blockeraTextShadow.default}
						{...extensionProps.blockeraTextShadow}
					/>
				</BaseControl>
			</ControlContextProvider>
		</EditorFeatureWrapper>
	);

	const renderTextTransform = (): MixedElement => (
		<EditorFeatureWrapper
			isActive={isShowTextTransform}
			config={extensionConfig.blockeraTextTransform}
		>
			<TextTransform
				block={block}
				value={values.blockeraTextTransform}
				defaultValue={attributes.blockeraTextTransform.default}
				onChange={handleAdvancedOnChange}
				{...extensionProps.blockeraTextTransform}
			/>
		</EditorFeatureWrapper>
	);

	const renderTextDecoration = (): MixedElement => (
		<EditorFeatureWrapper
			isActive={isShowTextDecoration}
			config={extensionConfig.blockeraTextDecoration}
		>
			<TextDecoration
				block={block}
				value={values.blockeraTextDecoration}
				defaultValue={attributes.blockeraTextDecoration.default}
				onChange={handleAdvancedOnChange}
				{...extensionProps.blockeraTextDecoration}
			/>
		</EditorFeatureWrapper>
	);

	const renderTextDirection = (): MixedElement => (
		<EditorFeatureWrapper
			isActive={isShowDirection}
			config={extensionConfig.blockeraDirection}
		>
			<TextDirection
				block={block}
				value={values.blockeraDirection}
				defaultValue={attributes.blockeraDirection.default}
				onChange={handleAdvancedOnChange}
				{...extensionProps.blockeraDirection}
			/>
		</EditorFeatureWrapper>
	);

	const renderTextOrientation = (): MixedElement => (
		<EditorFeatureWrapper
			isActive={isShowTextOrientation}
			config={extensionConfig.blockeraTextOrientation}
		>
			<TextOrientation
				block={block}
				value={values.blockeraTextOrientation}
				defaultValue={attributes.blockeraTextOrientation.default}
				onChange={handleAdvancedOnChange}
				{...extensionProps.blockeraTextOrientation}
			/>
		</EditorFeatureWrapper>
	);

	const renderSpacingGroup = (): MixedElement => (
		<ConditionalWrapper
			condition={!activeSearchMode}
			wrapper={(children) => (
				<BaseControl
					controlName="spacing"
					label={__('Spacing', 'blockera')}
					columns="1fr 2.5fr"
				>
					{children}
				</BaseControl>
			)}
			elseWrapper={(children) => <>{children}</>}
		>
			<EditorFeatureWrapper
				isActive={isShowLetterSpacing}
				config={extensionConfig.blockeraLetterSpacing}
			>
				<LetterSpacing
					block={block}
					value={values.blockeraLetterSpacing}
					onChange={handleAdvancedOnChange}
					defaultValue={attributes.blockeraLetterSpacing.default}
					activeSearchMode={activeSearchMode}
					{...extensionProps.blockeraLetterSpacing}
				/>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowWordSpacing}
				config={extensionConfig.blockeraWordSpacing}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'word-spacing'),
						value: values.blockeraWordSpacing,
						attribute: 'blockeraWordSpacing',
						blockName: block.blockName,
					}}
				>
					<InputControl
						columns={activeSearchMode ? '1fr 2.5fr' : '2fr 2fr'}
						label={
							activeSearchMode
								? __('Words Spacing', 'blockera')
								: __('Words', 'blockera')
						}
						labelPopoverTitle={__('Words Spacing', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It sets the space between words in text content, an essential tool for enhancing readability and typographic aesthetics, particularly in text-heavy layouts.',
										'blockera'
									)}
								</p>
							</>
						}
						arrows={true}
						unitType="letter-spacing"
						defaultValue={attributes.blockeraWordSpacing.default}
						onChange={(newValue, ref) =>
							handleAdvancedOnChange(
								'blockeraWordSpacing',
								newValue,
								{ ref }
							)
						}
						{...extensionProps.blockeraWordSpacing}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>

			<EditorFeatureWrapper
				isActive={isShowTextIndent}
				config={extensionConfig.blockeraTextIndent}
			>
				<ControlContextProvider
					value={{
						name: generateExtensionId(block, 'text-indent'),
						value: values.blockeraTextIndent,
						attribute: 'blockeraTextIndent',
						blockName: block.blockName,
					}}
				>
					<InputControl
						columns={activeSearchMode ? '1fr 2.5fr' : '2fr 2fr'}
						label={__('Text Indent', 'blockera')}
						labelDescription={
							<>
								<p>
									{__(
										'It sets the indentation of the first line in a text block, offering a stylistic tool for enhancing text layout and readability, especially in paragraphs and articles.',
										'blockera'
									)}
								</p>
							</>
						}
						arrows={true}
						unitType="text-indent"
						defaultValue={attributes.blockeraTextIndent.default}
						onChange={(newValue, ref) =>
							handleAdvancedOnChange(
								'blockeraTextIndent',
								newValue,
								{ ref }
							)
						}
						{...extensionProps.blockeraTextIndent}
					/>
				</ControlContextProvider>
			</EditorFeatureWrapper>
		</ConditionalWrapper>
	);

	const renderTextColumns = (): MixedElement => (
		<EditorFeatureWrapper
			isActive={isShowTextColumns}
			config={extensionConfig.blockeraTextColumns}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'text-columns'),
					value: values.blockeraTextColumns,
					type: 'nested',
					attribute: 'blockeraTextColumns',
					blockName: block.blockName,
				}}
			>
				<TextColumns
					value={values.blockeraTextColumns}
					display={display}
					handleOnChangeAttributes={handleAdvancedOnChange}
					defaultValue={attributes.blockeraTextColumns.default}
					{...extensionProps.blockeraTextColumns}
				/>
			</ControlContextProvider>
		</EditorFeatureWrapper>
	);

	const renderTextStroke = (): MixedElement => (
		<EditorFeatureWrapper
			isActive={isShowTextStroke}
			config={extensionConfig.blockeraTextStroke}
		>
			<ControlContextProvider
				value={{
					name: generateExtensionId(block, 'text-stroke'),
					value: values.blockeraTextStroke,
					type: 'nested',
					attribute: 'blockeraTextStroke',
					blockName: block.blockName,
				}}
			>
				<TextStroke
					value={values.blockeraTextStroke}
					handleOnChangeAttributes={handleAdvancedOnChange}
					defaultValue={attributes.blockeraTextStroke.default}
					{...extensionProps.blockeraTextStroke}
				/>
			</ControlContextProvider>
		</EditorFeatureWrapper>
	);

	const renderTextWrap = (): MixedElement => (
		<EditorFeatureWrapper
			isActive={isShowTextWrap}
			config={extensionConfig.blockeraTextWrap}
		>
			<TextWrap
				block={block}
				value={values.blockeraTextWrap}
				defaultValue={attributes.blockeraTextWrap.default}
				onChange={handleAdvancedOnChange}
				{...extensionProps.blockeraTextWrap}
			/>
		</EditorFeatureWrapper>
	);

	const renderWordBreak = (): MixedElement => (
		<EditorFeatureWrapper
			isActive={isShowWordBreak}
			config={extensionConfig.blockeraWordBreak}
		>
			<WordBreak
				block={block}
				value={values.blockeraWordBreak}
				defaultValue={attributes.blockeraWordBreak.default}
				onChange={handleAdvancedOnChange}
				{...extensionProps.blockeraWordBreak}
			/>
		</EditorFeatureWrapper>
	);

	const renderAllFeatures = (): MixedElement => (
		<>
			{renderTextShadow()}
			{renderTextTransform()}
			{renderTextDecoration()}
			{renderTextDirection()}
			{renderTextOrientation()}
			{isSpacingVisible && renderSpacingGroup()}
			{renderTextColumns()}
			{renderTextStroke()}
			{renderTextWrap()}
			{renderWordBreak()}
		</>
	);

	if (activeSearchMode || !shouldUseMoreFeatures) {
		return renderAllFeatures();
	}

	const isCollapsedEdited = (key: string): boolean =>
		!isPromoted(key) &&
		(isFeatureEdited(key, values, attributes) || hasPendingTouched(key));

	const isCollapsedAdvancedEdited =
		isCollapsedEdited('blockeraTextShadow') ||
		isCollapsedEdited('blockeraTextDecoration') ||
		isCollapsedEdited('blockeraTextTransform') ||
		isCollapsedEdited('blockeraDirection') ||
		isCollapsedEdited('blockeraTextOrientation') ||
		(!isSpacingPromoted &&
			SPACING_KEYS.some((key) => isCollapsedEdited(key))) ||
		isCollapsedEdited('blockeraTextColumns') ||
		isCollapsedEdited('blockeraTextStroke') ||
		isCollapsedEdited('blockeraWordBreak') ||
		isCollapsedEdited('blockeraTextWrap');

	const hasCollapsedTextShadow =
		isShowTextShadow && !isPromoted('blockeraTextShadow');
	const hasCollapsedTextTransform =
		isShowTextTransform && !isPromoted('blockeraTextTransform');
	const hasCollapsedTextDecoration =
		isShowTextDecoration && !isPromoted('blockeraTextDecoration');
	const hasCollapsedDirection =
		isShowDirection && !isPromoted('blockeraDirection');
	const hasCollapsedTextOrientation =
		isShowTextOrientation && !isPromoted('blockeraTextOrientation');
	const hasCollapsedSpacing = isSpacingVisible && !isSpacingPromoted;
	const hasCollapsedTextColumns =
		isShowTextColumns && !isPromoted('blockeraTextColumns');
	const hasCollapsedTextStroke =
		isShowTextStroke && !isPromoted('blockeraTextStroke');
	const hasCollapsedTextWrap =
		isShowTextWrap && !isPromoted('blockeraTextWrap');
	const hasCollapsedWordBreak =
		isShowWordBreak && !isPromoted('blockeraWordBreak');

	const hasCollapsedFeatures =
		hasCollapsedTextShadow ||
		hasCollapsedTextTransform ||
		hasCollapsedTextDecoration ||
		hasCollapsedDirection ||
		hasCollapsedTextOrientation ||
		hasCollapsedSpacing ||
		hasCollapsedTextColumns ||
		hasCollapsedTextStroke ||
		hasCollapsedTextWrap ||
		hasCollapsedWordBreak;

	return (
		<>
			{isShowTextShadow &&
				isPromoted('blockeraTextShadow') &&
				renderTextShadow()}
			{isShowTextTransform &&
				isPromoted('blockeraTextTransform') &&
				renderTextTransform()}
			{isShowTextDecoration &&
				isPromoted('blockeraTextDecoration') &&
				renderTextDecoration()}
			{isShowDirection &&
				isPromoted('blockeraDirection') &&
				renderTextDirection()}
			{isShowTextOrientation &&
				isPromoted('blockeraTextOrientation') &&
				renderTextOrientation()}
			{isSpacingVisible && isSpacingPromoted && renderSpacingGroup()}
			{isShowTextColumns &&
				isPromoted('blockeraTextColumns') &&
				renderTextColumns()}
			{isShowTextStroke &&
				isPromoted('blockeraTextStroke') &&
				renderTextStroke()}
			{isShowTextWrap &&
				isPromoted('blockeraTextWrap') &&
				renderTextWrap()}
			{isShowWordBreak &&
				isPromoted('blockeraWordBreak') &&
				renderWordBreak()}

			{hasCollapsedFeatures && (
				<MoreFeatures
					ariaLabel={__('More typography settings', 'blockera')}
					isOpen={false}
					isChanged={isCollapsedAdvancedEdited}
					isAnimated={true}
					onOpenChange={handleMoreFeaturesOpenChange}
				>
					{hasCollapsedTextShadow && renderTextShadow()}
					{hasCollapsedTextTransform && renderTextTransform()}
					{hasCollapsedTextDecoration && renderTextDecoration()}
					{hasCollapsedDirection && renderTextDirection()}
					{hasCollapsedTextOrientation && renderTextOrientation()}
					{hasCollapsedSpacing && renderSpacingGroup()}
					{hasCollapsedTextColumns && renderTextColumns()}
					{hasCollapsedTextStroke && renderTextStroke()}
					{hasCollapsedTextWrap && renderTextWrap()}
					{hasCollapsedWordBreak && renderWordBreak()}
				</MoreFeatures>
			)}
		</>
	);
};
