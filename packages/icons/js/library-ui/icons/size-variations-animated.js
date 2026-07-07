//@flow

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

export default function SizeVariationsAnimated({
	isAnimated = false,
	width = 24,
	height = 24,
}: {
	isAnimated: boolean,
	width: number,
	height: number,
}): React$Node {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classNames('blockera-size-variations-animated', {
				'is-animated': isAnimated,
			})}
		>
			<path d="M19.0003 18.9998H10.0003V9.99976H19.0003V18.9998Z" />
			<rect
				x="14"
				y="6.27246"
				width="5"
				height="1.27273"
				className="the-layer-top-width"
			/>
			<path d="M19 5V8.81836H17.7266V5H19Z" />
			<rect
				x="14"
				y="5"
				width="1.2734"
				height="3.81836"
				className="the-layer-top-bar"
			/>
			<rect
				x="5"
				y="15.2727"
				width="1.27273"
				height="3.81845"
				transform="rotate(-90 5 15.2727)"
				className="the-layer-left-width"
			/>
			<rect
				x="5"
				y="19"
				width="1.27273"
				height="3.81845"
				transform="rotate(-90 5 19)"
			/>
			<rect
				x="6.27463"
				y="14"
				width="1.27281"
				height="5"
				className="the-layer-left-bar"
			/>
		</svg>
	);
}
