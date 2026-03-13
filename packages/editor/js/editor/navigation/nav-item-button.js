// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import { Navigator } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { NavItemWrapper } from './nav-item-wrapper';
import { initPath } from './blockera-global-styles-navigation';

export const NavItemButton = ({
	id,
	icon,
	path,
	label,
	onClick,
	isComingSoon = false,
	className,
	...props
}: {
	id: string,
	path: string,
	'data-test'?: string,
	className?: string,
	icon: MixedElement,
	onClick?: () => void,
	isComingSoon?: boolean,
	label: string | MixedElement,
}): MixedElement => {
	const button = (
		<Navigator.Button
			{...props}
			data-test={props?.['data-test'] || path}
			id={id}
			path={initPath + path}
			onClick={onClick || (() => {})}
		>
			{icon}
			{!isComingSoon && label}
			{isComingSoon && (
				<>
					<span>{label}</span>
					<span className="coming-soon">
						{__('Soon', 'blockera')}
					</span>
				</>
			)}
		</Navigator.Button>
	);

	return className ? (
		<NavItemWrapper className={className}>{button}</NavItemWrapper>
	) : (
		button
	);
};
