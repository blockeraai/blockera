// @flow

/**
 * External dependencies
 */
import createSelector from 'rememo';

/**
 * Blockera dependencies
 */
import { prepare } from '@blockera/data-editor';
import { isString } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from '../../canvas-editor';
import type { InnerBlockType } from '../libs/inner-blocks/types';
import type { TBreakpoint, TStates } from '../libs/block-states/types';

/**
 * Returns a block extension by name.
 *
 * @param {Object} state Data state.
 * @param {string} name  Block type name.
 *
 * @example
 * ```js
 * import { store as blockExtensionsStore } from '@blockera/editor';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const buttonBlockExtension = useSelect( ( select ) =>
 *         ( select ) => select( blockExtensionsStore ).getBlockExtension( 'blockeraButton' ),
 *         []
 *     );
 *
 *     return (
 *         <ul>
 *             { buttonBlock &&
 *                 Object.entries( buttonBlock.supports ).map(
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
 * @return {Object} Block Extension.
 */
export function getBlockExtension(state: Object, name: string): Object {
	return state.blockExtensions[name];
}

/**
 * Returns a block extension by targetName.
 *
 * @param {Object} state Data state.
 * @param {string} field The block field name.
 * @param {string} name  Block extension targetName.
 *
 * @example
 * ```js
 * import { store as blockExtensionsStore } from '@blockera/editor';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const buttonBlockExtension = useSelect( ( select ) =>
 *         ( select ) => select( blockExtensionsStore ).getBlockExtensionBy( 'targetName', 'core/button' ),
 *         []
 *     );
 *
 *     return (
 *         <ul>
 *             { buttonBlock &&
 *                 Object.entries( buttonBlock.supports ).map(
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
 * @return {Object} Block Extension.
 */
export function getBlockExtensionBy(
	state: Object,
	field: string,
	name: string
): Object {
	return Object.entries(state.blockExtensions)
		.map((item) => (item[1][field] === name ? item[1] : null))
		.filter((item) => null !== item)[0];
}

/**
 * Returns all the available block extensions.
 *
 * @param {Object} state Data state.
 *
 * @example
 * ```js
 * import { store as blockExtensionsStore } from '@blockera/editor';
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
export const getBlockExtensions = (createSelector(
	(state) => Object.values(state.blockExtensions),
	(state) => [state.blockExtensions]
): Array<Object>);

/**
 * Returns the block extension support value, if defined.
 *
 * @param {Object}          state           Data state.
 * @param {(string|Object)} nameOrExtension Block extension name or extension object
 * @param {Array|string}    feature         Feature to retrieve
 * @param {*}               defaultExtensions Default value to return if not
 *                                          explicitly defined
 *
 * @example
 * ```js
 * import { __, sprintf } from '@wordpress/i18n';
 * import { store as extensionsStore } from '@blockera/editor';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const buttonBlockExtensionValue = useSelect( ( select ) =>
 *         select( extensionsStore ).buttonBlockExtensionValue( 'core/button', 'BorderAndShadow' ),
 *         []
 *     );
 *
 *     return (
 *         <p>
 *             { sprintf(
 *                 __( 'core/button extension field ['BorderAndShadow'] value: %s' ),
 *                 buttonBlockExtensionValue
 *             ) }
 *         </p>
 *     );
 * };
 * ```
 *
 * @return {?*} Block Extension value
 */
export const getBlockExtensionSupport = (
	state: Object,
	nameOrExtension: string | Object,
	feature: Array<string> | string,
	defaultExtensions: any
): Object | null => {
	const blockExtension = getNormalizedBlockExtension(state, nameOrExtension);
	if (!blockExtension?.supports) {
		return defaultExtensions;
	}

	return prepare(feature, blockExtension.supports) ?? defaultExtensions;
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
const getNormalizedBlockExtension = (
	state: Object,
	nameOrExtension: string | Object
): Object =>
	isString(nameOrExtension)
		? getBlockExtension(state, nameOrExtension)
		: nameOrExtension;

/**
 * Returns true if the block extension defines feature support for a feature, or false otherwise.
 *
 * @param {Object}          state Data state.
 * @param {(string|Object)} nameOrExtension Block extension name or extension object.
 * @param {string}          feature Feature to test.
 * @param {boolean}         defaultExtensions Whether feature is supported by
 * default if not explicitly defined.
 *
 * @example
 * ```js
 * import { __, sprintf } from '@wordpress/i18n';
 * import { store as extensionsStore } from '@blockera/editor';
 * import { useSelect } from '@wordpress/data';
 *
 * const ExampleComponent = () => {
 *     const hasButtonBlockExtensionSupportBoxShadow = useSelect( ( select ) =>
 *         select( extensionsStore ).hasBlockExtensionSupport( 'core/button', 'BoxShadow' ),
 *         []
 *     );
 *
 *     return (
 *         <p>
 *             { sprintf(
 *                 __( 'core/button extension support box-shadow feature?: %s' ),
 *                 hasButtonBlockExtensionSupportBoxShadow
 *             ) }
 *         /p>
 *     );
 * };
 * ```
 *
 * @return {boolean} Whether block Fields feature.
 */
export function hasBlockExtensionSupport(
	state: Object,
	nameOrExtension: string | Object,
	feature: string,
	defaultExtensions: any
): boolean {
	return !!getBlockExtensionSupport(
		state,
		nameOrExtension,
		feature,
		defaultExtensions
	);
}

/**
 * Get current block value of block extension.
 *
 * @param {Object} blockExtensions the block extension details.
 *
 * @return {"master"|"heading"|"paragraph"|"icon"|"button"|*|string} The inner block type or master.
 */
export function getExtensionCurrentBlock({
	blockExtensions,
}: Object): 'master' | InnerBlockType {
	return blockExtensions?.currentBlock || 'master';
}

/**
 * Get current block state type of block extension.
 *
 * @param {Object} blockExtensions the block extension details.
 *
 * @return {"master"|"heading"|"paragraph"|"icon"|"button"|*|string} The inner block type or master.
 */
export function getExtensionCurrentBlockState({
	blockExtensions,
}: Object): TStates {
	return blockExtensions?.currentStateType || 'normal';
}

/**
 * Get inner block state type of block extension.
 *
 * @param {Object} blockExtensions the block extension details.
 *
 * @return {"master"|"heading"|"paragraph"|"icon"|"button"|*|string} The inner block type or master.
 */
export function getExtensionInnerBlockState({
	blockExtensions,
}: Object): TStates {
	return blockExtensions?.currentInnerBlockState || 'normal';
}

/**
 * Get current block state type of block extension.
 *
 * @param {Object} blockExtensions the block extension details.
 *
 * @return {"master"|"heading"|"paragraph"|"icon"|"button"|*|string} The inner block type or master.
 */
export function getExtensionCurrentBlockStateBreakpoint({
	blockExtensions,
}: Object): TBreakpoint {
	return blockExtensions?.currentBreakpoint || getBaseBreakpoint();
}

/**
 * Get current block is active extensions?
 *
 * @param {Object} blockExtensions the block extension details.
 *
 * @return {boolean} true on success,false on otherwise!
 */
export function isActiveBlockExtensions({ blockExtensions }: Object): boolean {
	return 'undefined' === typeof blockExtensions?.isActiveExtensions
		? true
		: blockExtensions?.isActiveExtensions;
}

/**
 * Get active block variation in extensions.
 *
 * @param {Object} blockExtensions the block extension details.
 *
 * @return {Object | void} Object on success,false on otherwise!
 */
export function getActiveBlockVariation({
	blockExtensions,
}: Object): Object | void {
	return blockExtensions?.activeBlockVariation;
}

/**
 * Get master block state with client identifier.
 *
 * @param {Object} blockExtensions the block extension details.
 * @param {string} clientId the block client identifier.
 * @param {string} name the block name.
 * @return {*|string} the one of block state available types. by default return value is 'normal'.
 */
export function getActiveMasterState(
	{ blockExtensions }: Object,
	clientId: string,
	name: string
): TStates {
	return blockExtensions[clientId]
		? blockExtensions[clientId][name + '-active-state'] || 'normal'
		: 'normal';
}

/**
 * Get inner block state with client identifier and block type params.
 *
 * @param {Object} blockExtensions the block extension details.
 * @param {string} clientId the block client identifier.
 * @param {InnerBlockType} blockType the one of available inner block types.
 * @return {*|string} the one of block state available types. by default return value is 'normal'.
 */
export function getActiveInnerState(
	{ blockExtensions }: Object,
	clientId: string,
	blockType: InnerBlockType
): TStates {
	return blockExtensions[clientId]
		? blockExtensions[clientId][blockType + '-active-state'] || 'normal'
		: 'normal';
}

/**
 * Get block states with client identifier and block type params.
 *
 * @param {Object} blockExtensions the block extension details.
 * @param {string} clientId the block client identifier.
 * @param {'master'|InnerBlockType} blockType the one of available inner block types.
 * @return {*|string} the block states.
 */
export function getBlockStates(
	{ blockExtensions }: Object,
	clientId: string,
	blockType: 'master' | InnerBlockType
): Object {
	const initializeStates = {
		normal: {
			isVisible: true,
			breakpoints: {
				// $FlowFixMe
				[getBaseBreakpoint()]: {
					attributes: {},
				},
			},
		},
	};

	return blockExtensions[clientId]
		? blockExtensions[clientId][blockType + '-block-states'] ||
				initializeStates
		: initializeStates;
}

/**
 * Get block inners with client identifier and block type params.
 *
 * @param {Object} blockExtensions the block extension details.
 * @param {string} clientId the block client identifier.
 * @return {*|string} the block states.
 */
export function getBlockInners(
	{ blockExtensions }: Object,
	clientId: string
): Object {
	const initializeStates = {};

	return blockExtensions[clientId]
		? blockExtensions[clientId]?.innerBlocks || initializeStates
		: initializeStates;
}
