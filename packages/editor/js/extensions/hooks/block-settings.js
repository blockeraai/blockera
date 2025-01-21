// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { doAction } from '@wordpress/hooks';
import { useEffect, useMemo, createElement } from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Blockera dependencies
 */
import { BaseControlContext } from '@blockera/controls';
import {
	isEmpty,
	isObject,
	isFunction,
	mergeObject,
	isLoadedSiteEditor,
} from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	registerBlockExtensionsSupports,
	registerInnerBlockExtensionsSupports,
} from '../libs';
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../components';
import { STORE_NAME } from '../store/constants';
import { useStoreSelectors } from '../../hooks';
import { sanitizeDefaultAttributes } from './utils';
import { isBlockTypeExtension, isEnabledExtension } from '../api/utils';
import { BlockApp, BlockBase, BlockIcon, BlockPortals } from '../components';

const useSharedBlockSideEffect = (): void => {
	const {
		blockEditor: { getSelectedBlock },
	} = useStoreSelectors();
	const selectedBlock = getSelectedBlock();

	useEffect(() => {
		const blockCard = document.querySelector('.block-editor-block-card');

		if (blockCard) {
			blockCard.style.display = 'flex';
		}

		const blockVariations = document.querySelector(
			'.block-editor-block-inspector > .block-editor-block-variation-transforms'
		);

		if (blockVariations) {
			blockVariations.style.display = 'block';
		}

		const tabs = document.querySelector(
			'.block-editor-block-inspector .block-editor-block-inspector__tabs'
		);

		if (tabs) {
			tabs.style.display = 'block';
		}
	}, [selectedBlock]);
};

const EdiBlockWithoutExtensions = ({
	settings,
	...props
}: Object): MixedElement => {
	useSharedBlockSideEffect();

	const Edit = () => settings.edit(props);

	return (
		<ErrorBoundary
			fallbackRender={() => createElement(settings.edit, props)}
		>
			<Edit />
		</ErrorBoundary>
	);
};

type extraArguments = {
	currentUser: Object,
	notAllowedUsers: Array<string>,
	unsupportedBlocks: Array<string>,
};

/**
 * Filters registered WordPress block type settings, extending block settings with settings and block name.
 *
 * @param {Object} settings Original block settings.
 * @param {string} name block id or name.
 * @param {extraArguments} args the extra arguments includes unsupportedBlocks, notAllowedUsers, and currentUser properties.
 * @return {Object} Filtered block settings.
 */
export default function withBlockSettings(
	settings: Object,
	name: Object,
	args: extraArguments
): Object {
	const { getBlockExtensionBy } = select(STORE_NAME) || {};
	const { getExtension } = select('blockera/extensions/config');

	const blockExtension = getBlockExtensionBy('targetBlock', name);

	const { registerExtensions = null } = blockExtension || {};

	// On registering block type, we're firing bootstrapper scripts and add experimental extensions support.
	if ('function' === typeof registerExtensions) {
		registerExtensions(settings.name);
	} else if (!getExtension(settings.name)) {
		registerBlockExtensionsSupports(settings.name);
		registerInnerBlockExtensionsSupports(
			settings.name,
			blockExtension?.blockeraInnerBlocks || {}
		);
	}

	if (blockExtension && isBlockTypeExtension(blockExtension)) {
		return mergeBlockSettings(settings, blockExtension, args);
	}

	return {
		...settings,
		edit: (props) => (
			<EdiBlockWithoutExtensions {...{ ...props, settings }} />
		),
	};
}

/**
 * Merge settings of block type.
 *
 * @param {Object} settings The default WordPress block type settings
 * @param {Object} additional The additional settings of extension
 * @param {extraArguments} args the extra arguments includes unsupportedBlocks, notAllowedUsers, and currentUser properties.
 * @return {Object} merged settings!
 */
function mergeBlockSettings(
	settings: Object,
	additional: Object,
	{
		unsupportedBlocks = [],
		notAllowedUsers = [],
		currentUser,
	}: extraArguments
): Object {
	if (!isEnabledExtension(additional)) {
		return settings;
	}

	const {
		getSharedBlockAttributes = () => ({}),
		getBlockTypeAttributes = () => ({}),
	} = select('blockera/extensions') || {};

	const isAvailableBlock = () =>
		!unsupportedBlocks.includes(settings.name) &&
		!notAllowedUsers.filter((role) => currentUser.roles.includes(role))
			.length;

	const getVariations = (): Array<Object> => {
		if (!isAvailableBlock()) {
			return settings?.variations;
		}

		return [
			...(settings?.variations || []),
			...(additional.variations || []),
		].map((variation: Object): Object => {
			if (!variation?.icon) {
				return {
					...variation,
					icon: (
						<BlockIcon
							defaultIcon={settings.icon}
							name={settings.name}
						/>
					),
				};
			}

			return {
				...variation,
				icon: (
					<BlockIcon
						defaultIcon={variation.icon}
						name={settings.name}
					/>
				),
			};
		});
	};

	const blockeraOverrideBlockTypeAttributes = getBlockTypeAttributes(
		settings.name
	);
	const blockeraOverrideBlockAttributes = isEmpty(
		blockeraOverrideBlockTypeAttributes
	)
		? getSharedBlockAttributes()
		: blockeraOverrideBlockTypeAttributes;

	const Edit = (props: Object): MixedElement => {
		const baseContextValue = useMemo(
			() => ({
				components: {
					FeatureWrapper: EditorFeatureWrapper,
					AdvancedLabelControl: EditorAdvancedLabelControl,
				},
			}),
			[]
		);

		if (isFunction(additional?.edit) && isAvailableBlock()) {
			// Bootstrap canvas editor UI on WordPress site editor.
			if (isLoadedSiteEditor()) {
				/**
				 * Calls the callback functions that have been added to an action hook.
				 */
				doAction('blockera.mergeBlockSettings.Edit.component');
			}

			// eslint-disable-next-line
			const attributes = useMemo(() => {
				const { content, ...attributes } = props.attributes;

				return attributes;
			}, [props.attributes]);

			const defaultAttributes = !settings.attributes?.blockeraPropsId
				? mergeObject(
						blockeraOverrideBlockAttributes,
						settings.attributes
				  )
				: settings.attributes;

			return (
				<ErrorBoundary
					fallbackRender={() => createElement(settings.edit, props)}
				>
					<BaseControlContext.Provider value={baseContextValue}>
						<BlockApp
							{...{
								attributes,
								additional,
								name: props.name,
								clientId: props.clientId,
								className: props?.className,
								setAttributes: props.setAttributes,
								originDefaultAttributes: defaultAttributes,
								defaultAttributes: sanitizeDefaultAttributes(
									defaultAttributes,
									{ defaultWithoutValue: true }
								),
							}}
						>
							<BlockBase>
								<SlotFillProvider>
									<Slot name={'blockera-block-before'} />

									<BlockPortals
										blockId={`#block-${props.clientId}`}
										mainSlot={'blockera-block-slot'}
										slots={
											// slot selectors is feature on configuration block to create custom slots for anywhere.
											// we can add slotSelectors property on block configuration to handle custom preview of block.
											additional?.slotSelectors || {}
										}
									/>

									<Slot name={'blockera-block-after'} />
								</SlotFillProvider>
							</BlockBase>
						</BlockApp>
					</BaseControlContext.Provider>
					{settings.edit(props)}
				</ErrorBoundary>
			);
		}

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useSharedBlockSideEffect();

		return settings.edit(props);
	};

	return {
		...settings,
		// Sanitizing attributes to convert all array values to object.
		attributes: !settings.attributes?.blockeraPropsId
			? mergeObject(
					sanitizeDefaultAttributes(blockeraOverrideBlockAttributes),
					sanitizeDefaultAttributes(settings.attributes)
			  )
			: sanitizeDefaultAttributes(settings.attributes),
		supports: mergeObject(settings.supports, additional.supports),
		selectors: mergeObject(settings.selectors, additional.selectors),
		transforms: {
			...(settings?.transforms || {}),
			...(additional?.transforms || {}),
		},
		variations: getVariations(),
		edit: Edit,
		deprecated: !isAvailableBlock()
			? settings?.deprecated
			: [
					{
						attributes: settings.attributes,
						supports: settings.supports,
						migrate(attributes: Object): Object {
							return additional.migrate(attributes);
						},
						edit(blockProps: Object): MixedElement {
							return settings.edit(blockProps);
						},
						save(blockProps: Object): MixedElement {
							return settings.save(blockProps);
						},
					},
					...(settings?.deprecated || []),
			  ].filter(isObject),
		icon: !isAvailableBlock() ? (
			settings?.icon
		) : (
			<BlockIcon defaultIcon={settings.icon} name={settings.name} />
		),
	};
}
