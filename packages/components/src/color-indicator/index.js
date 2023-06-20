/**
 * Publisher dependencies
 */
import { componentClassNames } from '@publisher/classnames';

export default function ColorIndicator({
	className,
	value = '',
	type = 'color',
	size = 18,
	...props
}) {
	const style = {};
	let styleClassName = '';

	if (size !== 18) {
		style.width = size + 'px';
		style.height = size + 'px';
	}

	if (type === 'color') {
		if (value !== '' && value !== 'none') {
			style.background = value;
		}

		styleClassName =
			'color-' + (value === '' || value === 'none' ? 'none' : 'custom');
	} else if (type === 'image') {
		if (value !== '' && value !== 'none') {
			style.background = `url(${value})`;
			styleClassName = 'image-custom';
		} else {
			style.background =
				'repeating-conic-gradient(#c7c7c7 0%, #c7c7c7 25%, transparent 0%, transparent 50%) 50% center / 10px 10px'; // transparent image
			styleClassName = 'image-none';
		}
	} else if (type === 'linear-gradient') {
		if (value !== '' && value !== 'none') {
			style.background = value;
			styleClassName = 'linear-gradient-custom';
		} else {
			styleClassName = 'linear-gradient-none';
		}
	} else if (type === 'radial-gradient') {
		if (value !== '' && value !== 'none') {
			style.background = value;
			styleClassName = 'radial-gradient-custom';
		} else {
			styleClassName = 'radial-gradient-none';
		}
	}

	return (
		<span
			{...props}
			style={style}
			className={componentClassNames(
				'color-indicator',
				styleClassName,
				className
			)}
		></span>
	);
}

export function ColorIndicatorStack({
	className,
	value = [],
	size = 18,
	...props
}) {
	if (!value?.length) {
		return <></>;
	}

	const colorsStack = [];

	value.slice(0, 8).map((value) => {
		colorsStack.push(
			<ColorIndicator
				value={value?.value ? value?.value : value}
				type={value?.type ? value.type : 'color'}
				size={size}
				{...props}
			></ColorIndicator>
		);
		return null;
	});

	let space: string;
	if (colorsStack?.length < 4) {
		space = '-5px';
	} else {
		space = colorsStack?.length < 6 ? '-7px' : '-9px';
	}

	return (
		<div
			className={componentClassNames('color-indicator-stack', className)}
			style={{
				'--stack-space': space,
			}}
		>
			{colorsStack}
		</div>
	);
}
