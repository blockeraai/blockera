/**
 * External dependencies
 */
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
 *     const paragraphBlockExtension = useSelect( ( select ) =>
 *         ( select ) => select( blockExtensionsStore ).getBlockExtension( 'core/paragraph' ),
 *         []
 *     );
 *
 *     return (
 *         <ul>
 *             { paragraphBlock &&
 *                 Object.entries( paragraphBlock.supports ).map(
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
 *     const paragraphBlockSupports = useSelect( ( select ) =>
 *         ( select ) => select( blockExtensionsStore ).getBlockExtensionSupports( 'core/paragraph' ),
 *         []
 *     );
 *
 *     return (
 *         <ul>
 *             { paragraphBlockSupports &&
 *                 Object.entries( paragraphBlockSupports ).map(
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
	return state.blockExtensions[name]?.supports;
}
