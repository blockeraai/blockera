// @flow
import { type MixedElement } from 'react';

export const NavItemWrapper = ({
	children,
	className,
}: {
	children: MixedElement,
	className?: string,
}): MixedElement => <div className={className}>{children}</div>;
