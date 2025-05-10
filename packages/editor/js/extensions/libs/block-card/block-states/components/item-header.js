// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useContext } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import {
	InputControl,
	RepeaterContext,
	useControlContext,
	ControlContextProvider,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { TStates } from '../types';
import { getNormalizedCssSelector } from '../../../block-composite/search-items';

export default function ItemHeader({
	item,
	itemId,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}: {
	item: Object,
	itemId: TStates,
	isOpen: boolean,
	setOpen: (status: boolean) => void,
	children?: Element<any>,
	isOpenPopoverEvent: (event: SyntheticEvent<EventTarget>) => void,
}): Element<any> {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
		// eslint-disable-next-line react-hooks/rules-of-hooks
	} = useControlContext();

	const { onChange, valueCleanup } =
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useContext(RepeaterContext);
	//
	// const {
	// 	__experimentalSetPreviewDeviceType: setDeviceType,
	// 	// __experimentalGetPreviewDeviceType: getDeviceType,
	// 	// eslint-disable-next-line react-hooks/rules-of-hooks
	// } = useDispatch('core/edit-site') ? {} : useDispatch('core/edit-post');

	// const handleOnClick = (device: string): void => {
	// 	const modifiedBreakpoints = item.breakpoints.map((breakpoint) => {
	// 		if (breakpoint.type === device) {
	// 			return {
	// 				...breakpoint,
	// 				force: true,
	// 			};
	// 		}
	//
	// 		return breakpoint;
	// 	});
	// changeRepeaterItem({
	// 	itemId,
	// 	controlId,
	// 	value: {
	// 		...item,
	// 		breakpoints: modifiedBreakpoints,
	// 	},
	// });
	// };

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event) => isOpenPopoverEvent(event) && setOpen(!isOpen)}
			aria-label={sprintf(
				// translators: it's the aria label for repeater item
				__('Item %s', 'blockera'),
				itemId
			)}
		>
			{/*<span*/}
			{/*	className={controlInnerClassNames(*/}
			{/*		'header-icon'*/}
			{/*	)}*/}
			{/*>*/}
			{/*	{icon}*/}
			{/*</span>*/}

			{'custom-class' === item.type ? (
				<span className={controlInnerClassNames('header-label')}>
					<ControlContextProvider
						value={{
							name: controlId + '-' + item.type,
							value: item['css-class'] || '',
						}}
					>
						<InputControl
							className={controlInnerClassNames(
								'content-editable'
							)}
							aria-label={__('Custom Class', 'blockera')}
							placeholder="&.custom-class"
							defaultValue={item['css-class'] || ''}
							onChange={(newValue) => {
								changeRepeaterItem({
									value: {
										...item,
										'css-class':
											getNormalizedCssSelector(newValue),
									},
									itemId,
									onChange,
									controlId,
									valueCleanup,
									getId: (): TStates => itemId,
								});
							}}
						/>
					</ControlContextProvider>
				</span>
			) : (
				<span className={controlInnerClassNames('header-label')}>
					{item.label}
				</span>
			)}

			{/*<span className={controlInnerClassNames('header-settings')}>*/}
			{/*	<Icon*/}
			{/*		library={'wp'}*/}
			{/*		icon={'tablet'}*/}
			{/*		onClick={(event) => {*/}
			{/*			event.stopPropagation();*/}

			{/*			const getDeviceType =*/}
			{/*				select(*/}
			{/*					'core/edit-post'*/}
			{/*				).__experimentalGetPreviewDeviceType();*/}

			{/*			if ('Tablet' === getDeviceType) {*/}
			{/*				// eslint-disable-next-line no-unused-expressions*/}
			{/*				setDeviceType && setDeviceType('Desktop');*/}

			{/*				return;*/}
			{/*			}*/}

			{/*			// eslint-disable-next-line no-unused-expressions*/}
			{/*			setDeviceType && setDeviceType('Tablet');*/}

			{/*			handleOnClick('tablet');*/}
			{/*		}}*/}
			{/*	/>*/}
			{/*	<Icon*/}
			{/*		library={'wp'}*/}
			{/*		icon={'mobile'}*/}
			{/*		onClick={(event) => {*/}
			{/*			event.stopPropagation();*/}

			{/*			const getDeviceType =*/}
			{/*				select(*/}
			{/*					'core/edit-post'*/}
			{/*				).__experimentalGetPreviewDeviceType();*/}

			{/*			if ('Mobile' === getDeviceType) {*/}
			{/*				// eslint-disable-next-line no-unused-expressions*/}
			{/*				setDeviceType && setDeviceType('Desktop');*/}

			{/*				return;*/}
			{/*			}*/}

			{/*			// eslint-disable-next-line no-unused-expressions*/}
			{/*			setDeviceType && setDeviceType('Mobile');*/}

			{/*			handleOnClick('mobile');*/}
			{/*		}}*/}
			{/*	/>*/}
			{/*</span>*/}

			{/*<span*/}
			{/*	className={controlInnerClassNames(*/}
			{/*		'header-values'*/}
			{/*	)}*/}
			{/*>*/}
			{/*	{preview}*/}
			{/*</span>*/}

			{children}
		</div>
	);
}
