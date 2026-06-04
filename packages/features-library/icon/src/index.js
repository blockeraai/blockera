// @flow

/**
 * Internal dependencies
 */
import { icon } from './config';
import { IconStyles } from './extension/styles';
import { iconConfig } from './extension/supports';
import { IconExtension } from './extension/extension';
import { filterSetAttributes } from './set-attributes';
import { registerIconUploadSvgHandler } from './upload-svg-handler';
import type { TFeature } from '@blockera/features-core/Js/types';

registerIconUploadSvgHandler();

export const Icon: TFeature = {
	name: 'icon',
	filterSetAttributes,
	styleGenerator: IconStyles,
	extensionSupports: iconConfig,
	extensionSupportId: 'iconConfig',
	ExtensionComponent: IconExtension,
	isEnabled: (status = icon.block.status): boolean => status,
};

export * from './helpers';
export { CoreIconCanvasEdit } from './core-icon-canvas-edit';
export { icon } from './config';
export { iconConfig } from './extension/supports';
