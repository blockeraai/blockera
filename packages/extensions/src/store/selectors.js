/**
 * External dependencies
 */
import { get } from 'lodash';
import createSelector from 'rememo';

/**
 * Returns a block type by name.
 *
 * @param {Object} state Data state.
 * @param {string} name  Block type name.
 *
 * @example
 * ```js
 * import { store as blockExtensionsStore } from '@publisher/extensions';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const buttonBlockExtension = useSelect( ( select ) =>
 *         ( select ) => select( blockExtensionsStore ).getBlockExtension( 'core/button' ),
 *         []
 *     );
 *
 *     return (
 *         <ul>
 *             { buttonBlock &&
 *                 Object.entries( buttonBlock.publisherSupports ).map(
 *                     ( blockSupportsEntry ) => {
 *                         const [ propertyName, value ] = blockSupportsEntry;
 *                         return (
 *                             <li
 *                                 key={ propertyName }
 *                             >{ `${ propertyName } : ${ value }` }</li>
 *                         );
 *                     }
 *                 ) }
 *         </ul>
 *     );
 * };
 * ```
 *
 * @return {Object?} Block Extension.
 */
export function getBlockExtension(state, name) {
	return state.blockExtensions[name];
}

/**
 * Returns all the available block extensions.
 *
 * @param {Object} state Data state.
 *
 * @example
 * ```js
 * import { store as blockExtensionsStore } from '@publisher/extensions';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const blockExtensions = useSelect(
 *         ( select ) => select( blockExtensionsStore ).getBlockExtensions(),
 *         []
 *     );
 *
 *     return (
 *         <ul>
 *             { blockExtensions.map( ( block ) => (
 *                 <li key={ block.name }>{ block.title }</li>
 *             ) ) }
 *         </ul>
 *     );
 * };
 * ```
 *
 * @return {Array} Block Extensions.
 */
export const getBlockExtensions = createSelector(
	(state) => Object.values(state.blockExtensions),
	(state) => [state.blockExtensions]
);

/**
 * Returns a block extension supports by name.
 *
 * @param {Object} state Data state.
 * @param {string} name  Block extension name.
 *
 * @example
 * ```js
 * import { store as blockExtensionsStore } from '@publisher/extensions';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const buttonBlockSupports = useSelect( ( select ) =>
 *         ( select ) => select( blockExtensionsStore ).getBlockExtensionSupports( 'core/button' ),
 *         []
 *     );
 *
 *     return (
 *         <ul>
 *             { buttonBlockSupports &&
 *                 Object.entries( buttonBlockSupports ).map(
 *                     ( blockSupportsEntry ) => {
 *                         const [ propertyName, value ] = blockSupportsEntry;
 *                         return (
 *                             <li
 *                                 key={ propertyName }
 *                             >{ `${ propertyName } : ${ value }` }</li>
 *                         );
 *                     }
 *                 ) }
 *         </ul>
 *     );
 * };
 * ```
 *
 * @return {Object?} Block Extension.
 */
export function getBlockExtensionSupports(state, name) {
	return state.blockExtensions[name]?.publisherSupports;
}

/**
 * Returns the block extension support value for a feature, if defined.
 *
 * @param {Object}          state           Data state.
 * @param {(string|Object)} nameOrExtension Block extension name or extension object
 * @param {Array|string}    feature         Feature to retrieve
 * @param {*}               defaultSupports Default value to return if not
 *                                          explicitly defined
 *
 * @example
 * ```js
 * import { __, sprintf } from '@wordpress/i18n';
 * import { store as extensionsStore } from '@publisher/extensions';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const buttonBlockExtensionSupportValue = useSelect( ( select ) =>
 *         select( extensionsStore ).getBlockExtensionSupport( 'core/button', 'publisher-core/box-shadow' ),
 *         []
 *     );
 *
 *     return (
 *         <p>
 *             { sprintf(
 *                 __( 'core/button extension supports['publisher-core/box-shadow'] value: %s' ),
 *                 buttonBlockExtensionSupportValue
 *             ) }
 *         </p>
 *     );
 * };
 * ```
 *
 * @return {?*} Block support value
 */
export const getBlockExtensionSupport = (
	state,
	nameOrExtension,
	feature,
	defaultSupports
) => {
	const blockExtension = getNormalizedBlockExtension(state, nameOrExtension);
	if (!blockExtension?.publisherSupports) {
		return defaultSupports;
	}

	return get(blockExtension.publisherSupports, feature, defaultSupports);
};

/**
 * Given a block extension name or block extension object, returns the corresponding
 * normalized block extension object.
 *
 * @param {Object}          state      Block extensions state.
 * @param {(string|Object)} nameOrExtension Block extension name or extension object
 *
 * @return {Object} Block extension object.
 */
const getNormalizedBlockExtension = (state, nameOrExtension) =>
	'string' === typeof nameOrExtension
		? getBlockExtension(state, nameOrExtension)
		: nameOrExtension;

/**
 * Returns true if the block extension defines support for a feature, or false otherwise.
 *
 * @param {Object}          state           Data state.
 * @param {(string|Object)} nameOrExtension      Block extension name or extension object.
 * @param {string}          feature         Feature to test.
 * @param {boolean}         defaultSupports Whether feature is supported by
 *                                          default if not explicitly defined.
 *
 * @example
 * ```js
 * import { __, sprintf } from '@wordpress/i18n';
 * import { store as extensionsStore } from '@publisher/extensions';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const buttonBlockExtensionSupportBoxShadow = useSelect( ( select ) =>
 *         select( extensionsStore ).hasBlockExtensionSupport( 'core/button', 'publisher-core/box-shadow' ),
 *         []
 *     );
 *
 *     return (
 *         <p>
 *             { sprintf(
 *                 __( 'core/button extension supports box-shadow?: %s' ),
 *                 buttonBlockExtensionSupportBoxShadow
 *             ) }
 *         /p>
 *     );
 * };
 * ```
 *
 * @return {boolean} Whether block supports feature.
 */
export function hasBlockExtensionSupport(
	state,
	nameOrExtension,
	feature,
	defaultSupports
) {
	return !!getBlockExtensionSupport(
		state,
		nameOrExtension,
		feature,
		defaultSupports
	);
}
