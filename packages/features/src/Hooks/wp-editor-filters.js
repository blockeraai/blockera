// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../Js/store';
import { default as featuresLibrary } from '../Library';

export const wpEditorFilters = () => {
	addFilter(
		'editor.BlockListBlock',
		'blockera/edit-icon-styles',
		createHigherOrderComponent((BlockListBlock) => {
			return (props: blockProps) => {
				let { attributes, wrapperProps, name, clientId } = props;

				const { getFeatures } = select(STORE_NAME);
				const registeredFeatures = getFeatures();

				const { getBlockExtensionBy } = select('blockera/extensions');
				const blockExtension = getBlockExtensionBy('targetBlock', name);

				if (
					!blockExtension ||
					!attributes?.className ||
					!blockExtension?.blockFeatures
				) {
					return <BlockListBlock {...props} />;
				}

				for (const featureId in featuresLibrary) {
					const featureObject = registeredFeatures[featureId];

					if (
						!featureObject ||
						!featureObject?.isEnabled() ||
						!blockExtension?.blockFeatures?.[featureId]
					) {
						continue;
					}

					if (
						!attributes?.className?.includes('is-style-icon') &&
						!isButton
					) {
						return <BlockListBlock {...props} />;
					}
				}

				if (!wrapperProps) {
					wrapperProps = {
						style: {},
					};
				}

				wrapperProps.style = {
					...wrapperProps?.style,
					...getIconStyles(attributes),
				};

				const styles: genericStrings = {};

				if (attributes.iconSvgString) {
					styles['--wp--custom--icon--url'] =
						"url('data:image/svg+xml;utf8," +
						attributes.iconSvgString +
						"')";
				}

				return (
					<>
						<style>
							{'#block-' +
								clientId +
								'{' +
								cssObjectToString(styles) +
								'}'}
						</style>
						<BlockListBlock
							{...props}
							wrapperProps={wrapperProps}
						/>
					</>
				);
			};
		}, 'withIcon')
	);
};
