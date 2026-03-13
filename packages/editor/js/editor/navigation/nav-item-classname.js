// @flow

/**
 * Blockera dependencies
 */
import { extensionClassNames } from '@blockera/classnames';

export const navItemClassName = (conditionalClasses?: {
	[string]: boolean,
}): string => extensionClassNames('navigation-item', conditionalClasses || {});
