/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { default as blockSettings } from '../api/settings';
import { STORE_NAME } from '../store/constants';

/**
 * Publisher default CssGenerators object.
 *
 * @since 1.0.0
 */
const defaultCssGenerators = {};

/**
 * Filters registered block settings, extending block settings with settings and block name.
 *
 * @param {Object} settings Original block settings.
 * @param {string} name block id or name.
 * @return {Object} Filtered block settings.
 */
export default function withBlockSettings(
	settings: Object,
	name: Object
): Object {
	const { addSupports } = blockSettings;
	const { getBlockExtensions, getBlockExtension, hasBlockExtensionSupport } =
		select(STORE_NAME);
	const extensions = getBlockExtensions();
	const currentExtension = getBlockExtension(name);

	extensions.forEach(
		({
			name: extensionName,
			Edit = () => {},
			Save = () => {},
			publisherProps = {},
			publisherSupports = {},
			publisherCssGenerators = {},
			...extension
		}) => {
			if (
				!hasBlockExtensionSupport(currentExtension?.name, extensionName)
			) {
				return;
			}

			settings = {
				...settings,
				publisherEdit: Edit,
				publisherSave: Save,
				/**
				 * TODO: Please implements publisherProps data structure in future!
				 *
				 * @see {@link libs/publisher-core/README.md} references of final structure for publisherProps property!
				 */
				attributes: {
					...publisherProps,
					...settings.attributes,
				},
				supports: addSupports(settings.supports, publisherSupports),
				publisherCssGenerators: {
					...defaultCssGenerators,
					...publisherCssGenerators,
					...(settings?.publisherCssGenerators || {}),
				},
				...extension,
			};
		}
	);

	return settings;
}
