// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement } from 'react';
import { memo, useEffect } from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { BaseControlContext } from '@blockera/controls';
import { isObject, isFunction, mergeObject, isEmpty } from '@blockera/utils';

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
import { isBlockTypeExtension, isEnabledExtension } from '../api/utils';
import { sanitizedBlockAttributes, sanitizeDefaultAttributes } from './utils';
import {
	BlockBase,
	BlockPortals,
	BlockIcon,
	propsAreEqual,
} from '../components';

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

	return settings.edit(props);
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

	const blockExtension = getBlockExtensionBy('targetBlock', name);

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
	const { getExtension } = select('blockera/extensions/config');

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

	const { registerExtensions = null } = additional;

	// On registering block type, we're firing bootstrapper scripts and add experimental extensions support.
	if ('function' === typeof registerExtensions) {
		registerExtensions(settings.name);
	} else if (!getExtension(settings.name)) {
		registerBlockExtensionsSupports(settings.name);
		registerInnerBlockExtensionsSupports(
			settings.name,
			additional?.blockeraInnerBlocks || {}
		);
	}

	const Edit = memo((props: Object): MixedElement => {
		if (isFunction(additional?.edit) && isAvailableBlock()) {
			const baseContextValue = {
				components: {
					FeatureWrapper: EditorFeatureWrapper,
					AdvancedLabelControl: EditorAdvancedLabelControl,
				},
			};

			return (
				<BaseControlContext.Provider value={baseContextValue}>
					<BlockBase
						{...{
							...props,
							additional,
							defaultAttributes: !settings.attributes
								?.blockeraPropsId
								? mergeObject(
										settings.attributes,
										blockeraOverrideBlockAttributes
								  )
								: settings.attributes,
						}}
					>
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
					{settings.edit(props)}
				</BaseControlContext.Provider>
			);
		}

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useSharedBlockSideEffect();

		return settings.edit(props);
	}, propsAreEqual);

	return {
		...settings,
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
		save(props: Object): MixedElement {
			if (!isAvailableBlock()) {
				return settings?.save(props);
			}

			props = {
				...props,
				attributes: sanitizedBlockAttributes(
					props.attributes,
					settings?.attributes
				),
			};

			return settings.save(props);
		},
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
