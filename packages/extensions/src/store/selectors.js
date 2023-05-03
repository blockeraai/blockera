/**
 * WordPress dependencies
 */
import { pipe } from '@wordpress/compose';
/**
 * External dependencies
 */
import createSelector from 'rememo';
import removeAccents from 'remove-accents';
import { get } from 'lodash';

/**
 * Returns a block type by name.
 *
 * @param {Object} state Data state.
 * @param {string} name  Block type name.
 *
 * @example
 * ```js
 * import { store as blocksStore } from '@wordpress/blocks';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const paragraphBlock = useSelect( ( select ) =>
 *         ( select ) => select( blocksStore ).getBlockExtension( 'core/paragraph' ),
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
 * Returns all the available block types.
 *
 * @param {Object} state Data state.
 *
 * @example
 * ```js
 * import { store as blocksStore } from '@wordpress/blocks';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const blockExtension = useSelect(
 *         ( select ) => select( blocksStore ).getBlockExtension(),
 *         []
 *     );
 *
 *     return (
 *         <ul>
 *             { blockExtension.map( ( block ) => (
 *                 <li key={ block.name }>{ block.title }</li>
 *             ) ) }
 *         </ul>
 *     );
 * };
 * ```
 *
 * @return {Array} Block Extension.
 */
export const getBlockExtensions = createSelector(
	(state) => Object.values(state.blockExtensions),
	(state) => [state.blockExtensions]
);
