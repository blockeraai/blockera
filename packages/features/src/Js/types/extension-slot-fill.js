// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';

export type TExtensionSlotFillProps = {
	block: Object,
	settings: Object,
	slotName: string,
	attributes: Object,
	additional: Object,
	currentStateAttributes: Object,
	handleOnChangeSettings: (newSupports: Object, name: string) => void,
	handleOnChangeAttributes: (attributes: Object, ref: Object) => void,
};

export type TExtensionFillComponentProps = ComponentType<{
	block: Object,
	settings: Object,
	attributes: Object,
	currentStateAttributes: Object,
	handleOnChangeSettings: (newSupports: Object, name: string) => void,
	handleOnChangeAttributes: (attributes: Object, ref: Object) => void,
}>;
