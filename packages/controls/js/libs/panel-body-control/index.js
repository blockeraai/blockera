//@flow
/**
 * External dependencies
 */
import { Icon, Button } from '@wordpress/components';
import type { MixedElement, ComponentType } from 'react';
import { chevronUp, chevronDown } from '@wordpress/icons';
import { useRef, forwardRef, useState, useEffect } from '@wordpress/element';
import { useReducedMotion, useMergeRefs } from '@wordpress/compose';

/**
 * Blockera dependencies
 */
import { noop } from '@blockera/utils';
import {
	controlClassNames,
	classNames as classnames,
} from '@blockera/classnames';

/**
 * Internal Dependencies
 */
import { useUpdateEffect } from './utils';
import { ChangeIndicator } from '../../index';
import { PoweredBy } from './components/powered-by';
import type { PanelBodyControlProps } from './types';

const PanelBodyControl: ComponentType<PanelBodyControlProps> = forwardRef(
	(
		{
			title,
			initialOpen = true,
			isChanged = false,
			isChangedOnStates = false,
			className,
			icon,
			children,
			onToggle,
			scrollAfterOpen = false,
			showPoweredBy = false,
			...props
		}: PanelBodyControlProps,
		ref: Object
	): MixedElement => {
		return (
			<PanelBody
				title={
					<>
						{title}
						<ChangeIndicator
							isChanged={isChanged}
							isChangedOnStates={isChangedOnStates}
						/>
					</>
				}
				initialOpen={initialOpen}
				className={controlClassNames('panel-body', className)}
				icon={icon ? <span>{icon}</span> : ''} // by wrapping icon inside a tag the WPPanelBody wraps it inside a tag with components-panel__icon class
				onToggle={onToggle}
				scrollAfterOpen={scrollAfterOpen}
				{...props}
				ref={ref}
			>
				{children}

				{showPoweredBy && <PoweredBy />}
			</PanelBody>
		);
	}
);

export const UnforwardedPanelBody = (
	props: Object,
	ref: Object
): MixedElement => {
	const {
		buttonProps = {},
		children,
		className,
		icon,
		initialOpen,
		onToggle = noop,
		title,
		scrollAfterOpen = true,
	} = props;
	const [isOpened, setIsOpened] = useState(
		initialOpen === undefined ? true : initialOpen
	);
	const nodeRef = useRef(null);

	// Defaults to 'smooth' scrolling
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
	const scrollBehavior = useReducedMotion() ? 'auto' : 'smooth';

	const handleOnToggle = (event: any) => {
		event.preventDefault();
		const next = !isOpened;
		setIsOpened(next);
		onToggle(next);
	};

	useEffect(() => setIsOpened(initialOpen), [initialOpen]);

	// Ref is used so that the effect does not re-run upon scrollAfterOpen changing value.
	const scrollAfterOpenRef = useRef();
	scrollAfterOpenRef.current = scrollAfterOpen;
	// Runs after initial render.
	useUpdateEffect(() => {
		if (
			isOpened &&
			scrollAfterOpenRef.current &&
			nodeRef.current?.scrollIntoView
		) {
			/*
			 * Scrolls the content into view when visible.
			 * This improves the UX when there are multiple stacking <PanelBody />
			 * components in a scrollable container.
			 */
			nodeRef.current.scrollIntoView({
				inline: 'nearest',
				block: 'nearest',
				behavior: scrollBehavior,
			});
		}
	}, [isOpened, scrollBehavior]);

	const classes = classnames('components-panel__body', className, {
		'is-opened': isOpened,
	});

	return (
		<div className={classes} ref={useMergeRefs([nodeRef, ref])}>
			<PanelBodyTitle
				icon={icon}
				isOpened={Boolean(isOpened)}
				onClick={handleOnToggle}
				title={title}
				{...buttonProps}
			/>
			{typeof children === 'function'
				? children({ opened: Boolean(isOpened) })
				: isOpened && children}
		</div>
	);
};

const PanelBodyTitle: ComponentType<any> = forwardRef(
	({ isOpened, icon, title, ...props }: Object, ref: Object) => {
		if (!title) return null;

		return (
			<h2 className="components-panel__body-title">
				<Button
					className="components-panel__body-toggle"
					aria-expanded={isOpened}
					ref={ref}
					{...props}
				>
					{/*
					Firefox + NVDA don't announce aria-expanded because the browser
					repaints the whole element, so this wrapping span hides that.
				*/}
					<span aria-hidden="true">
						<Icon
							className="components-panel__arrow"
							icon={isOpened ? chevronUp : chevronDown}
						/>
					</span>
					{title}
					{icon && (
						<Icon
							icon={icon}
							className="components-panel__icon"
							size={20}
						/>
					)}
				</Button>
			</h2>
		);
	}
);

const PanelBody: ComponentType<any> = forwardRef(UnforwardedPanelBody);

export default PanelBodyControl;
