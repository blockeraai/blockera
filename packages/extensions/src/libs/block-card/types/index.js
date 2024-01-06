// @flow

import type { THandleOnChangeAttributes } from '../../types';

export type PropTypes = {
	supports: Object,
	clientId: string,
	blockName: string,
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
