// @flow
import { select } from '@wordpress/data';

export const useBlocksStore = (): Object => {
	return select('core/blocks');
};
