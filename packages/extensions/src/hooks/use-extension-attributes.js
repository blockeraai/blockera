// @flow

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Add custom  props identifier to selected blocks
 *
 * @param {Object} props Block props
 * @return {{}|Object} Block props extended with  Extensions.
 */
export const useAttributes = (props: Object): Object => {
	const extendedProps = { ...props };

	if (isUndefined(extendedProps.attributes.blockeraPropsId)) {
		const d = new Date();
		extendedProps.attributes.blockeraPropsId =
			'' +
			d.getMonth() +
			d.getDate() +
			d.getHours() +
			d.getMinutes() +
			d.getSeconds() +
			d.getMilliseconds();
	}

	return extendedProps;
};
