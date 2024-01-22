// @flow
/**
 * External dependencies
 */
import { Fill } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import type { Element, MixedElement, ComponentType } from 'react';
import { select, useSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	memo,
	useRef,
	useMemo,
	useState,
	useEffect,
	StrictMode,
} from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { useCssGenerator } from '@publisher/style-engine';
import { extensionClassNames } from '@publisher/classnames';
import {
	indexOf,
	isEquals,
	isUndefined,
	omitWithPattern,
} from '@publisher/utils';

/**
 * Internal dependencies
 */
import {
	useIconEffect,
	useAttributes,
	BlockEditContextProvider,
} from '../hooks';
import { sanitizedBlockAttributes } from '../hooks/utils';
import { SideEffect } from '../libs/base/components/side-effect';
import type { BreakpointTypes, StateTypes } from '../libs/block-states/types';
import { BlockCard } from '../libs/block-card';
import { BlockPartials } from './block-partials';
import * as config from '../libs/base/config';
import styleGenerators from '../libs/shared/style-generators';
import StatesManager from '../libs/block-states/components/states-manager';
import { propsAreEqual } from './utils';
import type { InnerBlockType } from '../libs/inner-blocks/types';
import {
	definitionTypes,
	ignoreDefaultBlockAttributeKeysRegExp,
} from '../libs';

export type BlockBaseProps = {
	additional: Object,
	children: MixedElement,
	name: string,
	clientId: string,
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	className: string,
};

export const BlockBase: ComponentType<BlockBaseProps> = memo(
	({
		additional,
		children,
		name,
		clientId,
		attributes,
		setAttributes,
		className,
		...props
	}: BlockBaseProps): Element<any> | null => {
		const { __experimentalGetPreviewDeviceType: getDeviceType } = window?.wp
			?.editPost
			? select('core/edit-post')
			: select('core/edit-site');

		const isNormalState = () =>
			'normal' === attributes?.publisherCurrentState &&
			/desktop/i.test(getDeviceType());

		/**
		 * Filterable attributes before initializing block edit component.
		 *
		 * hook: 'publisherCore.blockEdit.attributes'
		 *
		 * @since 1.0.0
		 */
		attributes = applyFilters(
			'publisherCore.blockEdit.attributes',
			attributes,
			{
				blockId: name,
				blockClientId: clientId,
				isNormalState,
			}
		);

		// Declare backup attributes state to clonedAttributes to manage re-rendering process order by self policies.
		const [clonedAttributes, setClonedAttributes] = useState(attributes);

		const [currentTab, setCurrentTab] = useState(
			additional?.activeTab || 'style'
		);
		const [currentBlock, setCurrentBlock] = useState('master');
		const [isOpenGridBuilder, setOpenGridBuilder] = useState(false);

		const handleOnSwitchBlockSettings = (
			_currentBlock: 'master' | InnerBlockType
		): void => {
			setCurrentBlock(_currentBlock);
		};

		const { supports } = useSelect((select) => {
			const { getBlockType } = select('core/blocks');

			return getBlockType(name);
		});

		const blockEditRef = useRef(null);

		useIconEffect(
			{
				name,
				clientId,
				blockRefId: blockEditRef,
				publisherIcon: attributes?.publisherIcon,
				publisherIconGap: attributes?.publisherIconGap,
				publisherIconSize: attributes?.publisherIconSize,
				publisherIconColor: attributes?.publisherIconColor,
				publisherIconPosition: attributes?.publisherIconPosition,
			},
			[attributes]
		);

		const { edit: BlockEditComponent } = additional;

		useEffect(() => {
			const publisherAttributes = omitWithPattern(
				sanitizedBlockAttributes(attributes),
				ignoreDefaultBlockAttributeKeysRegExp()
			);

			if (
				isUndefined(attributes.publisherPropsId) &&
				0 < Object.keys(publisherAttributes)?.length
			) {
				const d = new Date();
				setAttributes({
					...attributes,
					publisherPropsId:
						'' +
						d.getMonth() +
						d.getDate() +
						d.getHours() +
						d.getMinutes() +
						d.getSeconds() +
						d.getMilliseconds(),
				});
			}

			return undefined;
			// eslint-disable-next-line
		}, []);

		const _attributes: Object = useMemo(() => {
			const _className = extensionClassNames(
				{
					[className]: true,
					'publisher-extension-ref': true,
					[`client-id-${clientId}`]: true,
				},
				additional.editorProps.className
			);

			return {
				...attributes,
				_className,
			};
			// eslint-disable-next-line
		}, []);

		const blockStates = attributes?.publisherBlockStates.map(
			(state: StateTypes) => state.type
		);

		const currentStateIndex = blockStates?.indexOf(
			attributes?.publisherCurrentState
		);
		const blockStateId = -1 === currentStateIndex ? 0 : currentStateIndex;

		const breakpointId = indexOf(
			attributes?.publisherBlockStates[blockStateId]?.breakpoints.map(
				(breakpoint: BreakpointTypes) => breakpoint.label
			),
			getDeviceType()
		);

		const getAttributes = (key: string = ''): any => {
			if (key && attributes[key]) {
				return attributes[key];
			}

			return attributes;
		};

		// Updating attributes just when changes clonedAttributes.
		useEffect(() => {
			if (!isEquals(attributes, clonedAttributes)) {
				setAttributes({
					...attributes,
					...omitWithPattern(
						clonedAttributes,
						ignoreDefaultBlockAttributeKeysRegExp()
					),
				});
			}
			// eslint-disable-next-line
		}, [clonedAttributes]);

		const { handleOnChangeAttributes } = useAttributes(
			clonedAttributes,
			setClonedAttributes,
			{
				currentBlock,
				blockStateId,
				breakpointId,
				isNormalState,
				getAttributes,
				blockId: name,
			}
		);

		const styles = [];
		const generatorSharedProps = {
			attributes,
			activeDeviceType: getDeviceType(),
			blockName: name,
			callbackProps: {
				...config,
				blockProps: {
					clientId,
					supports,
					setAttributes,
				},
			},
		};

		Object.entries(styleGenerators).forEach(
			([supportId, { callback, fallbackSupportId }]) =>
				styles.push(
					// eslint-disable-next-line react-hooks/rules-of-hooks
					useCssGenerator({
						callback,
						supportId,
						fallbackSupportId,
						...generatorSharedProps,
					}).join('\n')
				)
		);

		const currentStateAttributes = isNormalState()
			? attributes
			: {
					...attributes,
					...(attributes.publisherBlockStates[blockStateId]
						.breakpoints[breakpointId]
						? attributes.publisherBlockStates[blockStateId]
								.breakpoints[breakpointId].attributes
						: {}),
			  };

		const FillComponents = (): MixedElement => {
			return (
				<>
					<Fill name={`publisher-block-card-content-${clientId}`}>
						<BlockCard
							clientId={clientId}
							selectedInnerBlock={
								'master' === currentBlock
									? undefined
									: currentBlock
							}
							handleOnClick={handleOnSwitchBlockSettings}
							states={attributes.publisherBlockStates}
							innerBlocks={attributes.publisherInnerBlocks}
						>
							<StatesManager
								states={attributes.publisherBlockStates}
								block={{
									clientId,
									supports,
									attributes,
									setAttributes,
									blockName: name,
								}}
							/>
						</BlockCard>
					</Fill>
					<Fill
						name={`publisher-${currentBlock}-block-${attributes.publisherCurrentState}-edit-content-${clientId}`}
					>
						<BlockEditComponent
							{...{
								// Sending props like exactly "edit" function props of WordPress Block.
								// Because needs total block props in outside overriding component like "publisher-blocks" in overriding process.
								name,
								clientId,
								supports,
								className,
								attributes,
								setAttributes,
								currentStateAttributes,
								...props,
							}}
						/>
					</Fill>
				</>
			);
		};

		return (
			<BlockEditContextProvider
				{...{
					block: {
						blockName: name,
						clientId,
						handleOnChangeAttributes,
						attributes,
						storeName: 'publisher-core/controls',
					},
					currentTab,
					blockStateId,
					breakpointId,
					currentBlock,
					setCurrentTab,
					isNormalState,
					setAttributes,
					getAttributes,
					isOpenGridBuilder,
					setOpenGridBuilder,
					attributes: _attributes,
					handleOnChangeAttributes,
					handleOnSwitchBlockSettings,
					extensionConfig: definitionTypes,
					BlockComponent: () => children,
					activeDeviceType: getDeviceType(),
					getBlockType: () =>
						select('core/blocks').getBlockType(name),
				}}
			>
				<StrictMode>
					<InspectorControls>
						<SideEffect
							{...{
								currentTab,
								currentState: attributes.publisherCurrentState,
							}}
						/>
						<BlockPartials
							clientId={clientId}
							currentBlock={currentBlock}
							currentState={attributes.publisherCurrentState}
						/>
					</InspectorControls>
					<div ref={blockEditRef} />

					<FillComponents />

					<style
						data-block-type={name}
						dangerouslySetInnerHTML={{
							__html: styles
								.filter((style: string) => style)
								.join('\n')
								.trim(),
						}}
					/>
				</StrictMode>

				{children}
			</BlockEditContextProvider>
		);
	},
	propsAreEqual
);
