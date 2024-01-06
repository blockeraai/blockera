// @flow
/**
 * External dependencies
 */
import type { Element, MixedElement } from 'react';
import { select, useSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import { StrictMode, useMemo, useRef, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { extensionClassNames } from '@publisher/classnames';
import { indexOf, isUndefined, omitWithPattern } from '@publisher/utils';

/**
 * Internal dependencies
 */
import {
	useIconEffect,
	useAttributes,
	BlockEditContext,
	BlockEditContextProvider,
} from '../hooks';
import { sanitizedBlockAttributes } from '../hooks/utils';
import { SideEffect } from '../libs/base/components/side-effect';
import type { BreakpointTypes, StateTypes } from '../libs/block-states/types';
import { GridBuilder } from './grid-builder';
import { BlockCardWrapper } from '../libs/block-card';

export function BlockBase({
	additional,
	children,
	name,
	clientId,
	attributes,
	setAttributes,
	className,
}: {
	additional: Object,
	children: MixedElement,
	name: string,
	clientId: string,
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	className: string,
}): Element<any> | null {
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

	let blockStateId = blockStates?.indexOf(attributes?.publisherCurrentState);

	if (-1 === blockStateId) {
		blockStateId = 0;

		setAttributes({
			...attributes,
			publisherCurrentState: 'normal',
		});
	}

	const breakpointId = indexOf(
		attributes?.publisherBlockStates[blockStateId]?.breakpoints.map(
			(breakpoint: BreakpointTypes) => breakpoint.label
		),
		getDeviceType()
	);

	const { handleOnChangeAttributes } = useAttributes(
		attributes,
		setAttributes,
		{
			blockStateId,
			breakpointId,
			isNormalState,
		}
	);

	const blockEditComponentAttributes = isNormalState()
		? attributes
		: {
				...attributes,
				...(attributes.publisherBlockStates[blockStateId].breakpoints[
					breakpointId
				]
					? attributes.publisherBlockStates[blockStateId].breakpoints[
							breakpointId
					  ].attributes
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
				getAttributes: (key: string): any => {
					if (key && attributes[key]) {
						return attributes[key];
					}

					return attributes;
				},
				activeDeviceType: getDeviceType(),
				handleOnChangeAttributes,
				getBlockType: () => select('core/blocks').getBlockType(name),
			}}
		>
			<StrictMode>
				<InspectorControls>
					<SideEffect />
				</InspectorControls>
				<div ref={blockEditRef} />
				<InspectorControls>
					<BlockCardWrapper
						block={{
							clientId,
							supports,
							blockName: name,
							attributes,
							setAttributes,
						}}
					/>
				</InspectorControls>
				<BlockEditComponent
					supports={supports}
					blockName={name}
					clientId={clientId}
					setAttributes={setAttributes}
					attributes={blockEditComponentAttributes}
					currentState={attributes.publisherCurrentState}
				/>
			</StrictMode>

			<BlockEditContext.Consumer>
				{({ isOpenGridBuilder }) => {
					if (!isOpenGridBuilder) {
						return children;
					}

					return (
						<GridBuilder
							type={name}
							id={clientId}
							position={{ top: 0, left: 0 }}
							dimension={{ width: 320, height: 200 }}
						>
							{children}
						</GridBuilder>
					);
				}}
			</BlockEditContext.Consumer>
		</BlockEditContextProvider>
	);
}
