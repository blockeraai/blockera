// @flow
/**
 * External dependencies
 */
import {
	getBlockVariations,
	registerBlockVariation,
	unregisterBlockVariation,
} from '@wordpress/blocks';
import { select } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';
import { useEffect, createElement, useMemo } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { useBugReporter } from '@blockera/telemetry';
import {
	omit,
	isEmpty,
	isObject,
	isFunction,
	mergeObject,
} from '@blockera/utils';

/**
 * Internal dependencies
 */
import { FallbackUI } from '../fallback-ui';
import {
	registerBlockExtensionsSupports,
	registerInnerBlockExtensionsSupports,
} from '../libs';
import { STORE_NAME } from '../store/constants';
import { useStoreSelectors, useBlockSideEffectsRestore } from '../../hooks';
import { sanitizeDefaultAttributes } from './utils';
import { isBlockTypeExtension, isEnabledExtension } from '../api/utils';
import { BlockIcon } from '../components';
import { Edit } from '../components/block-edit';
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../components';
import bootstrapScripts from '../scripts';

export const useSharedBlockSideEffect = (): void => {
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

	useBlockSideEffectsRestore(selectedBlock);
};

const EdiBlockWithoutExtensions = ({
	settings,
	...props
}: Object): MixedElement => {
	useSharedBlockSideEffect();

	return createElement(settings.edit, props);
};

type extraArguments = {
	currentUser: Object,
	allowedUsers: Array<string>,
	unsupportedBlocks: Array<string>,
	allowedPostTypes: Array<string>,
};

const registeredBlockTypes = new Map<string, Object>();

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
	if (registeredBlockTypes.has(name)) {
		return registeredBlockTypes.get(name);
	}

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

	let result = {};

	if (blockExtension && isBlockTypeExtension(blockExtension)) {
		result = mergeBlockSettings(settings, blockExtension, args);
		registeredBlockTypes.set(name, result);

		return result;
	}

	result = {
		...settings,
		edit: (props: Object): MixedElement => (
			<EdiBlockWithoutExtensions {...{ ...props, settings }} />
		),
	};

	registeredBlockTypes.set(name, result);

	return result;
}

export const ErrorBoundaryFallback: ComponentType<Object> = ({
	error,
	from,
	setNotice,
	fallbackComponent,
	props,
	clientId,
	...rest
}: Object): MixedElement => {
	useBugReporter({
		error,
		...rest,
	});

	return (
		<FallbackUI
			{...rest}
			from={from}
			id={clientId}
			error={error}
			setNotice={setNotice}
			fallbackComponentProps={props}
			fallbackComponent={fallbackComponent}
		/>
	);
};

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
		allowedUsers = [],
		currentUser,
		allowedPostTypes = [],
	}: extraArguments
): Object {
	/**
	 * Filters the additional settings of extension.
	 *
	 * External developers can use this filter to modify the additional settings of extension.
	 *
	 * @since 1.12.2
	 */
	additional = applyFilters(
		'blockera.editor.extensions.mergeBlockSettings',
		additional,
		settings
	);

	if (!isEnabledExtension(additional)) {
		return settings;
	}

	const {
		getSharedBlockAttributes = () => ({}),
		getBlockTypeAttributes = () => ({}),
	} = select('blockera/extensions') || {};
	const { blockeraCurrentPostType } = window;

	const isAvailableBlock = () => {
		// While the not changed, the block is available.
		if (
			!unsupportedBlocks.length &&
			!allowedUsers.length &&
			!allowedPostTypes.length
		) {
			return true;
		}

		// If the block is not supported with restricted visibility by block type name and post type, it is not available.
		if (
			!allowedUsers.length &&
			allowedPostTypes.length &&
			unsupportedBlocks.length
		) {
			return !blockeraCurrentPostType
				? !unsupportedBlocks.includes(settings.name)
				: !unsupportedBlocks.includes(settings.name) &&
						allowedPostTypes.includes(blockeraCurrentPostType);
		}

		// If the block is not supported with restricted visibility by user roles and block type name, it is not available.
		if (
			!allowedPostTypes.length &&
			allowedUsers.length &&
			unsupportedBlocks.length
		) {
			return (
				!unsupportedBlocks.includes(settings.name) &&
				allowedUsers.filter((role) => currentUser.roles.includes(role))
					.length
			);
		}

		// If the block is not supported with restricted visibility by user roles and post type, it is not available.
		if (
			!unsupportedBlocks.length &&
			allowedUsers.length &&
			allowedPostTypes.length &&
			blockeraCurrentPostType
		) {
			return (
				allowedUsers.filter((role) => currentUser.roles.includes(role))
					.length &&
				allowedPostTypes.includes(blockeraCurrentPostType)
			);
		}

		// If the block is not supported with restricted visibility by post type, it is not available.
		if (
			!unsupportedBlocks.length &&
			!allowedUsers.length &&
			allowedPostTypes.length &&
			blockeraCurrentPostType
		) {
			return allowedPostTypes.includes(blockeraCurrentPostType);
		}

		// If the block is not supported with restricted visibility by user roles, block type name, and post type, it is not available.
		if (
			!unsupportedBlocks.length &&
			!allowedPostTypes.length &&
			allowedUsers.length
		) {
			return allowedUsers.filter((role) =>
				currentUser.roles.includes(role)
			).length;
		}

		// If the block is not supported, it is not available.
		return !unsupportedBlocks.includes(settings.name);
	};

	const getVariations = (): Array<Object> => {
		if (!isAvailableBlock()) {
			return settings?.variations;
		}

		// Re-register the block variations with blockera icon.
		getBlockVariations(settings.name)?.forEach((variation) => {
			if (variation?.icon?.props?.defaultIcon) {
				return;
			}
			unregisterBlockVariation(settings.name, variation.name);
			registerBlockVariation(settings.name, {
				...variation,
				icon: (
					<BlockIcon
						defaultIcon={variation?.icon || settings?.icon}
						name={settings.name}
					/>
				),
			});
		});

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

	return {
		...settings,
		styles: [...(settings?.styles || []), ...(additional?.styles || [])],
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
		edit: (props) => {
			const { attributes: _attributes, ...rest } = props;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const attributes = useMemo(
				() => omit(_attributes, ['content', 'text']),
				[_attributes]
			);

			// eslint-disable-next-line react-hooks/rules-of-hooks
			const stableAdditional = useMemo(() => {
				return additional;
			}, []);

			// eslint-disable-next-line react-hooks/rules-of-hooks
			const baseContextValue = useMemo(
				() => ({
					components: {
						FeatureWrapper: EditorFeatureWrapper,
						AdvancedLabelControl: EditorAdvancedLabelControl,
					},
				}),
				[]
			);

			const selectedBlock =
				select('core/block-editor').getSelectedBlock();

			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				if (!selectedBlock) {
					return;
				}
				// On rendering the block settings, we can bootstrap all scripts.
				bootstrapScripts();
			}, [selectedBlock]);

			if (isFunction(additional?.edit) && isAvailableBlock()) {
				return (
					<>
						<Edit
							{...rest}
							baseContextValue={baseContextValue}
							attributes={attributes}
							settings={settings}
							additional={stableAdditional}
							isAvailableBlock={isAvailableBlock}
							blockeraOverrideBlockAttributes={
								blockeraOverrideBlockAttributes
							}
						/>
						{settings.edit(props)}
					</>
				);
			}

			// eslint-disable-next-line react-hooks/rules-of-hooks
			useSharedBlockSideEffect();

			return settings.edit(props);
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
