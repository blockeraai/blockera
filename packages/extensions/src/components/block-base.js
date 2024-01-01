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
	BlockEditContextProvider,
} from '../hooks';
import { BlockStates } from '../libs';
import { sanitizedBlockAttributes } from '../hooks/utils';
import { SideEffect } from '../libs/base/components/side-effect';
import type { BreakpointTypes, StateTypes } from '../libs/block-states/types';
import { GridBuilder } from './grid-builder';

export function BlockBase({
	additional,
	children,
	...props
}: {
	additional: Object,
	children: MixedElement,
}): Element<any> | null {
	const { supports } = useSelect((select) => {
		const { getBlockType } = select('core/blocks');

		return getBlockType(props.name);
	});

	const { __experimentalGetPreviewDeviceType: getDeviceType } = window?.wp
		?.editPost
		? select('core/edit-post')
		: select('core/edit-site');

	const blockEditRef = useRef(null);

	useIconEffect(
		{
			name: props.name,
			clientId: props.clientId,
			blockRefId: blockEditRef,
			publisherIcon: props?.attributes?.publisherIcon,
			publisherIconGap: props?.attributes?.publisherIconGap,
			publisherIconSize: props?.attributes?.publisherIconSize,
			publisherIconColor: props?.attributes?.publisherIconColor,
			publisherIconPosition: props?.attributes?.publisherIconPosition,
		},
		[props.attributes]
	);

	const { edit: BlockEditComponent } = additional;

	useEffect(() => {
		const publisherAttributes = omitWithPattern(
			sanitizedBlockAttributes(props.attributes),
			/^(?!publisher\w+).*/i
		);

		if (
			isUndefined(props.attributes.publisherPropsId) &&
			0 < Object.keys(publisherAttributes)?.length
		) {
			const d = new Date();
			props.setAttributes({
				...props.attributes,
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

	const attributes: Object = useMemo(() => {
		const className = extensionClassNames(
			{
				[props.className]: true,
				'publisher-extension-ref': true,
				[`client-id-${props.clientId}`]: true,
			},
			additional.editorProps.className
		);

		return {
			...props.attributes,
			className,
		};
		// eslint-disable-next-line
	}, []);

	const isNormalState = () =>
		'normal' === props.attributes?.publisherCurrentState &&
		/desktop/i.test(getDeviceType());

	const blockStates = props.attributes?.publisherBlockStates.map(
		(state: StateTypes) => state.type
	);

	let blockStateId = blockStates?.indexOf(
		props.attributes?.publisherCurrentState
	);

	if (-1 === blockStateId) {
		blockStateId = 0;

		props.setAttributes({
			...props.attributes,
			publisherCurrentState: 'normal',
		});
	}

	const breakpointId = indexOf(
		props.attributes?.publisherBlockStates[blockStateId]?.breakpoints.map(
			(breakpoint: BreakpointTypes) => breakpoint.label
		),
		getDeviceType()
	);

	const { handleOnChangeAttributes } = useAttributes(
		props.attributes,
		props.setAttributes,
		{
			blockStateId,
			breakpointId,
			isNormalState,
		}
	);

	const blockEditComponentAttributes = isNormalState()
		? props.attributes
		: {
				...props.attributes,
				...(props.attributes.publisherBlockStates[blockStateId]
					.breakpoints[breakpointId]
					? props.attributes.publisherBlockStates[blockStateId]
							.breakpoints[breakpointId].attributes
					: {}),
		  };

	return (
		<BlockEditContextProvider
			{...{
				block: {
					blockName: props.name,
					clientId: props.clientId,
					handleOnChangeAttributes,
					attributes: props.attributes,
					storeName: 'publisher-core/controls',
				},
				attributes,
				blockStateId,
				breakpointId,
				isNormalState,
				setAttributes: props.setAttributes,
				getAttributes: () => props.attributes,
				activeDeviceType: getDeviceType(),
				handleOnChangeAttributes,
				getBlockType: () =>
					select('core/blocks').getBlockType(props.name),
			}}
		>
			<StrictMode>
				<InspectorControls>
					<SideEffect />
				</InspectorControls>
				<div ref={blockEditRef} />
				<InspectorControls>
					<BlockStates
						attributes={props.attributes}
						blockName={props.name}
						clientId={props.clientId}
						supports={supports}
						setAttributes={props.setAttributes}
					/>
				</InspectorControls>
				<BlockEditComponent
					supports={supports}
					blockName={props.name}
					clientId={props.clientId}
					setAttributes={props.setAttributes}
					attributes={blockEditComponentAttributes}
					currentState={props.attributes.publisherCurrentState}
				/>
			</StrictMode>

			{blockEditComponentAttributes.publisherIsOpenGridBuilder && (
				<GridBuilder
					type={props.name}
					id={props.clientId}
					position={{ top: 0, left: 0 }}
					dimension={{ width: 320, height: 200 }}
				>
					{children}
				</GridBuilder>
			)}
			{!blockEditComponentAttributes.publisherIsOpenGridBuilder &&
				children}
		</BlockEditContextProvider>
	);
}
