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
import {
	memo,
	useMemo,
	useState,
	useEffect,
	createElement,
} from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Blockera dependencies
 */
import { useBugReporter } from '@blockera/telemetry';
import { BaseControlContext } from '@blockera/controls';
import { isEmpty, isObject, isFunction, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { FallbackUI } from '../fallback-ui';
import {
	registerBlockExtensionsSupports,
	registerInnerBlockExtensionsSupports,
} from '../libs';
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../components';
import { STORE_NAME } from '../store/constants';
import { useStoreSelectors, useBlockSideEffectsRestore } from '../../hooks';
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

export const ErrorBoundaryFallback: ComponentType<Object> = memo(
	({
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
	}
);

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

			const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
				// eslint-disable-next-line react-hooks/rules-of-hooks
				useState(false);

			return (
				<ErrorBoundary
					fallbackRender={({ error }) => (
						<ErrorBoundaryFallback
							{...{
								props,
								error,
								from: 'root',
								clientId: props.clientId,
								isReportingErrorCompleted,
								setIsReportingErrorCompleted,
								fallbackComponent: settings.edit,
							}}
						/>
					)}
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
