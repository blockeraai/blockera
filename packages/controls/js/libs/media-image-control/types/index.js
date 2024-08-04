// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type MediaImageControlProps = {
	...ControlGeneralTypes,
	/**
	 * Label for choose button while the image control is empty
	 */
	labelChoose?: string,
	/**
	 * The `Media Library` button label.
	 */
	labelMediaLibrary?: string,
	/**
	 * The `Upload Image` button label.
	 */
	labelUploadImage?: string,
};
