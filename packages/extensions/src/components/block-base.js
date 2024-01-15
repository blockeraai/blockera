// @flow
/**
 * External dependencies
 */
import { Fill } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import type { Element, MixedElement } from 'react';
import { select, useSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	memo,
	StrictMode,
	useMemo,
	useRef,
	useEffect,
} from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { useCssGenerator } from '@publisher/style-engine';
import { extensionClassNames } from '@publisher/classnames';
import { indexOf, isUndefined, omitWithPattern } from '@publisher/utils';

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

export type BlockBaseProps = {
	additional: Object,
	children: MixedElement,
	name: string,
	clientId: string,
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	className: string,
};

export const BlockBase: BlockBaseProps = memo(
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
		/**
		 * Filterable attributes before initializing block edit component.
		 *
		 * hook: 'publisherCore.blockEdit.attributes'
		 *
		 * @since 1.0.0
		 */
		attributes = applyFilters(
			'publisherCore.blockEdit.attributes',
			attributes
		);

		const { supports } = useSelect((select) => {
			const { getBlockType } = select('core/blocks');

			return getBlockType(name);
		});

		const { __experimentalGetPreviewDeviceType: getDeviceType } = window?.wp
			?.editPost
			? select('core/edit-post')
			: select('core/edit-site');

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
				/^(?!publisher\w+).*/i
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

		const isNormalState = () =>
			'normal' === attributes?.publisherCurrentState &&
			/desktop/i.test(getDeviceType());

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

		const { handleOnChangeAttributes } = useAttributes(
			attributes,
			setAttributes,
			{
				blockStateId,
				breakpointId,
				isNormalState,
				getAttributes,
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
					attributes: _attributes,
					blockStateId,
					breakpointId,
					isNormalState,
					setAttributes,
					getAttributes,
					activeDeviceType: getDeviceType(),
					handleOnChangeAttributes,
					BlockComponent: () => children,
					getBlockType: () =>
						select('core/blocks').getBlockType(name),
					activeTab: additional?.activeTab || 'style',
				}}
			>
				<StrictMode>
					<InspectorControls>
						<SideEffect />
						<BlockPartials
							clientId={clientId}
							currentState={attributes.publisherCurrentState}
						/>
					</InspectorControls>
					<div ref={blockEditRef} />

					<Fill name={`publisher-block-card-content-${clientId}`}>
						<BlockCard
							clientId={clientId}
							states={attributes.publisherBlockStates}
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
						name={`publisher-block-${attributes.publisherCurrentState}-edit-content-${clientId}`}
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
