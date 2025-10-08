// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { Slot } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';
import {
	useRef,
	useState,
	useMemo,
	useEffect,
	useCallback,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { kebabCase, mergeObject } from '@blockera/utils';
import { Tooltip, Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { Breadcrumb } from './breadcrumb';
import { default as BlockIcon } from './block-icon';
import { useBlockSection } from '../../../components';
import { EditableBlockName } from './editable-block-name';
import type { TStyleVariationBlockCardProps } from '../types';
import StateContainer from '../../../components/state-container';
import { Preview as BlockCompositePreview } from '../../block-composite';
import BlockPreviewPanel from '../../../../canvas-editor/components/block-global-styles-panel-screen/block-preview-panel';

const DEBOUNCE_DELAY = 300;

export function StyleVariationBlockCard({
	clientId,
	isActive,
	children,
	supports,
	blockName,
	handleOnClick,
	currentBlock,
	currentState,
	setAttributes,
	currentBreakpoint,
	availableStates,
	additional,
	insideBlockInspector,
	currentStateAttributes,
	currentInnerBlockState,
	handleOnChangeAttributes,
	currentBlockStyleVariation,
	setCurrentBlockStyleVariation,
}: TStyleVariationBlockCardProps): MixedElement {
	const { onToggle } = useBlockSection('innerBlocksConfig');
	const { blockeraGlobalStylesMetaData } = window;

	const postId = select('core').__experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);

	const initializeTitle = useMemo(
		() =>
			blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations?.[
				currentBlockStyleVariation?.name
			]?.label ||
			currentBlockStyleVariation?.label ||
			'',
		[blockeraGlobalStylesMetaData, blockName, currentBlockStyleVariation]
	);

	const refId = useRef(
		blockeraGlobalStylesMetaData?.blocks?.[blockName]?.variations?.[
			currentBlockStyleVariation.name
		]?.refId || currentBlockStyleVariation.name
	);
	const [title, setTitle] = useState(initializeTitle);
	const [hasUserEdited, setHasUserEdited] = useState(false);

	const updateGlobalStyles = useCallback(
		(newTitle: string) => {
			if (!hasUserEdited) return;

			const { blockeraMetaData = {} } = globalStyles;
			const updatedMetaData = mergeObject(blockeraMetaData, {
				blocks: {
					[blockName]: {
						variations: {
							[kebabCase(newTitle)]: {
								label: newTitle,
								refId: refId.current,
							},
						},
					},
				},
			});

			delete updatedMetaData.blocks[blockName].variations[
				currentBlockStyleVariation.name
			];

			const editedStyle = {
				name: kebabCase(newTitle),
				label: newTitle,
			};

			setCurrentBlockStyleVariation(editedStyle);

			const editedGlobalStyles = mergeObject(globalStyles, {
				blocks: {
					[blockName]: {
						variations: {
							[editedStyle.name]:
								globalStyles?.blocks?.[blockName]?.variations?.[
									currentBlockStyleVariation.name
								],
						},
					},
				},
			});

			delete editedGlobalStyles?.blocks?.[blockName]?.variations?.[
				currentBlockStyleVariation.name
			];

			const hasCustomizations =
				globalStyles?.blocks?.[blockName]?.variations?.[
					currentBlockStyleVariation.name
				];

			setGlobalStyles({
				...(hasCustomizations ? editedGlobalStyles : globalStyles),
				blockeraMetaData: updatedMetaData,
			});

			registerBlockStyle(blockName, editedStyle);
			unregisterBlockStyle(blockName, currentBlockStyleVariation.name);

			window.blockeraGlobalStylesMetaData = updatedMetaData;
			setHasUserEdited(false);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			globalStyles,
			blockName,
			currentBlockStyleVariation.name,
			setGlobalStyles,
			hasUserEdited,
		]
	);

	useEffect(() => {
		refId.current = currentBlockStyleVariation.name;
	}, [currentBlockStyleVariation.name]);

	useEffect(() => {
		if (hasUserEdited) return;

		if (
			(!title && initializeTitle) ||
			(title && initializeTitle && title !== initializeTitle)
		) {
			setTitle(initializeTitle);
		}
	}, [title, hasUserEdited, initializeTitle]);

	useEffect(() => {
		if (!title || !initializeTitle || title === initializeTitle) return;

		const timeoutId = setTimeout(
			() => updateGlobalStyles(title),
			DEBOUNCE_DELAY
		);
		return () => clearTimeout(timeoutId);
	}, [title, updateGlobalStyles, initializeTitle, hasUserEdited]);

	if (!currentBlockStyleVariation?.name) {
		return <></>;
	}

	const handleTitleChange = (newTitle: string) => {
		const currentLabel =
			globalStyles?.blockeraMetaData?.blocks?.[blockName]?.variations?.[
				currentBlockStyleVariation?.name
			]?.label;

		if (currentLabel === newTitle) return;

		setHasUserEdited(true);
		setTitle(newTitle);
	};

	const handleClose = () => {
		onToggle(true, 'switch-to-parent');
		handleOnClick('current-block-style-variation', undefined);
	};

	return (
		<div
			className={extensionClassNames(
				'block-card',
				'block-card--style-variation'
			)}
			data-test={'blockera-style-variation-block-card'}
		>
			<div
				className={extensionInnerClassNames(
					'block-card__style-variation'
				)}
			>
				<BlockIcon
					icon={
						<Icon
							icon="style-variations-animated"
							iconSize={24}
							isAnimated={true}
						/>
					}
				/>

				<div
					className={extensionInnerClassNames('block-card__content')}
				>
					{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
					<h2
						className={extensionInnerClassNames(
							'block-card__title'
						)}
					>
						<Flex
							justifyContent="center"
							alignItems="center"
							className={extensionInnerClassNames(
								'block-card__title__input',
								{
									'is-edited':
										currentBlockStyleVariation &&
										currentBlockStyleVariation?.label !==
											title,
									'inside-block-inspector': true,
								}
							)}
						>
							<EditableBlockName
								content={title}
								placeholder={currentBlockStyleVariation?.label}
								onChange={handleTitleChange}
								contentEditable={true}
							/>
						</Flex>

						<Breadcrumb
							clientId={clientId}
							blockName={blockName}
							activeBlock={currentBlockStyleVariation?.name}
							availableStates={availableStates}
							blockeraUnsavedData={
								currentStateAttributes?.blockeraUnsavedData
							}
						/>

						<Tooltip text={__('Close Block Style', 'blockera')}>
							<Icon
								className={extensionInnerClassNames(
									'block-card__close'
								)}
								library="wp"
								icon="close-small"
								iconSize="24"
								data-test="Close Block Style"
								onClick={handleClose}
							/>
						</Tooltip>
					</h2>
				</div>
			</div>

			<BlockPreviewPanel
				name={blockName}
				variation={currentBlockStyleVariation?.name}
			/>

			<Flex
				gap={10}
				direction="column"
				style={{
					margin: '0 -3px',
				}}
			>
				<StateContainer
					name={blockName}
					clientId={clientId}
					isGlobalStylesCard={true}
					insideBlockInspector={insideBlockInspector}
					availableStates={availableStates}
					blockeraUnsavedData={
						currentStateAttributes?.blockeraUnsavedData
					}
				>
					<Slot
						name={`blockera-${kebabCase(
							currentBlockStyleVariation?.name
						)}-style-variation-block-card-children`}
					/>
				</StateContainer>

				{children}

				{isActive && (
					<BlockCompositePreview
						block={{
							clientId,
							supports,
							blockName,
							setAttributes,
						}}
						availableStates={availableStates}
						onChange={handleOnChangeAttributes}
						currentBlock={currentBlock}
						currentState={currentState}
						currentBreakpoint={currentBreakpoint}
						currentInnerBlockState={currentInnerBlockState}
						blockConfig={additional}
						blockStatesProps={{
							attributes: currentStateAttributes,
							id: `block-states-${kebabCase(
								currentBlockStyleVariation?.name
							)}`,
						}}
					/>
				)}
			</Flex>
		</div>
	);
}
