// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { store as extensionStore } from '../store';

/**
 * Defined behavior of a block extension type.
 *
 * @typedef {Object} blockeraBlockExtensionType
 *
 * @property {string}             name          Block extension type's namespaced name.
 * @property {Object}             [attributes]  Block extension attributes.
 * @property {WPComponent}        [Save]        Optional component describing
 *                                              serialized markup structure of a
 *                                              block extension type.
 * @property {WPComponent}        Edit          Component rendering an element to
 *                                              manipulate the attributes of a block
 *                                              in the context of an editor.
 * @property {Object}             [example]     Example provides structured data for
 *                                              the block preview. When not defined
 *                                              then no preview is shown.
 */

export type blockeraBlockExtensionType = {
	name: string,
	example: Object,
	selectors: Object,
	edit: MixedElement,
	attributes: Object,
	save: MixedElement,
	slotSelectors: Object,
};

/**
 * Registers a new block extension in three types (field, extension, and block) provided a unique name and an object defining its
 * behavior. Once registered, the block extension is made available as an option to any
 * editor interface where block extensions are implemented.
 *
 * For more in-depth information on registering a custom block extension see the [Create a block extension tutorial](docs/how-to-guides/block-extension-tutorial/README.md)
 *
 * @param {string} name the block extension name
 * @param type
 * @param {Object} settings the block settings
 *
 * * @example
 * ```js
 * import { __ } from '@wordpress/i18n';
 * import { registerBlockExtension } from '@blockera/editor'
 *
 * registerBlockExtension( 'namespace/extension-name', {
 *     title: __( 'My First Block Extension' ),
 * } );
 * ```
 *
 * @return {blockeraBlockExtensionType|undefined} The block extension, if it has been successfully registered;
 *                    otherwise `undefined`.
 */

export function registerBlockExtension(
	name: string,
	{ type = 'block', ...settings }: Object
): Object | void {
	if (!isString(name)) {
		console.error('Block extension names must be strings.');
		return;
	}

	if (!/^(blockera|[A-Z][a-z0-9-]).*(?:[A-Z][a-z0-9-])*$/.test(name)) {
		console.error(
			'Block extension names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter. Example: "blockeraMyCustomBlockExtension" or "MyCustomBlockExtension"'
		);
		return;
	}
	if (select(extensionStore).getBlockExtension(name)) {
		console.error('Block extension "' + name + '" is already registered.');
		return;
	}

	if (!['block', 'extension', 'field'].includes(type)) {
		console.error(
			`Block Extension type must be equals with "extension", "block" or "field" this type is ${type}, Block Extension type validation error!`
		);
		return;
	}

	const blockExtension = {
		name,
		type,
		label: '',
		icon: null,
		status: true,
		supports: {},
		isOpen: false,
		saveProps: {},
		attributes: {},
		description: '',
		editorProps: {},
		targetBlock: null,
		cssGenerators: [],
		...settings,
	};

	dispatch(extensionStore).__experimentalRegisterBlockExtension(
		blockExtension
	);

	return select(extensionStore).getBlockExtension(name);
}

/**
 * Unregister a block extension.
 *
 * @param {string} name Block extension name.
 *
 * @example
 * ```js
 * import { __ } from '@wordpress/i18n';
 * import { unregisterBlockExtension } from '@blockera/editor';
 *
 * const ExampleComponent = () => {
 *     return (
 *         <Button
 *             onClick={ () =>
 *                 unregisterBlockExtension( 'my-collection/extension-name' )
 *             }
 *         >
 *             Unregister my custom block extension.
 *         </Button>
 *     );
 * };
 * ```
 *
 * @return {WPBlockType | void} The previous block extension value, if it has been successfully
 *                    unregistered; otherwise `undefined`.
 */
export function unregisterBlockExtension(name: string): Object | void {
	const oldExtension = select(extensionStore).getBlockExtension(name);

	if (!oldExtension) {
		console.error('Block extensions "' + name + '" is not registered.');
		return;
	}

	dispatch(extensionStore).removeBlockExtensions(name);

	return oldExtension;
}
