// @flow

/**
 * Internal dependencies
 */
import { default as Blob1Icon } from './shapes/blob-1.svg';
import { default as Blob2Icon } from './shapes/blob-2.svg';
import { default as Blob3Icon } from './shapes/blob-3.svg';
import { default as Blob4Icon } from './shapes/blob-4.svg';
import { default as Blob5Icon } from './shapes/blob-5.svg';
import { default as Blob6Icon } from './shapes/blob-6.svg';
import { default as Blob7Icon } from './shapes/blob-7.svg';
import { default as Blob8Icon } from './shapes/blob-8.svg';
import { default as Blob9Icon } from './shapes/blob-9.svg';
import { default as Blob10Icon } from './shapes/blob-10.svg';
import { default as Blob11Icon } from './shapes/blob-11.svg';
import { default as Blob12Icon } from './shapes/blob-12.svg';
import { default as Sketch1Icon } from './shapes/sketch-1.svg';
import { default as Sketch2Icon } from './shapes/sketch-2.svg';
import { default as Sketch3Icon } from './shapes/sketch-3.svg';
import { default as Sketch4Icon } from './shapes/sketch-4.svg';
import { default as Sketch5Icon } from './shapes/sketch-5.svg';
import { default as Sketch6Icon } from './shapes/sketch-6.svg';
import { default as Sketch7Icon } from './shapes/sketch-7.svg';
import { default as Sketch8Icon } from './shapes/sketch-8.svg';
import { default as PaintCircle1Icon } from './shapes/paint-circle-1.svg';
import { default as PaintCircle2Icon } from './shapes/paint-circle-2.svg';
import { default as PaintCircle3Icon } from './shapes/paint-circle-3.svg';
import { default as PaintCircle4Icon } from './shapes/paint-circle-4.svg';
import { default as Splatter1Icon } from './shapes/splatter-1.svg';
import { default as Splatter2Icon } from './shapes/splatter-2.svg';
import { default as Splatter3Icon } from './shapes/splatter-3.svg';
import { default as Splatter4Icon } from './shapes/splatter-4.svg';
import { default as CircleIcon } from './shapes/circle.svg';
import { default as TriangleIcon } from './shapes/triangle.svg';
import { default as HexagonIcon } from './shapes/hexagon.svg';
import { default as OctagonIcon } from './shapes/octagon.svg';
import { default as FlowerIcon } from './shapes/flower.svg';
import { default as MultiplicationIcon } from './shapes/multiplication.svg';
import { default as StarIcon } from './shapes/star.svg';
import { default as StairsIcon } from './shapes/stairs.svg';

export const maskShapeIcons = [
	{ id: 'Blob 1', icon: (<Blob1Icon data-test="blob-1" />: any) },
	{ id: 'Blob 2', icon: (<Blob2Icon data-test="blob-2" />: any) },
	{ id: 'Blob 3', icon: (<Blob3Icon data-test="blob-3" />: any) },
	{ id: 'Blob 4', icon: (<Blob4Icon data-test="blob-4" />: any) },
	{ id: 'Blob 5', icon: (<Blob5Icon data-test="blob-5" />: any) },
	{ id: 'Blob 6', icon: (<Blob6Icon data-test="blob-6" />: any) },
	{ id: 'Blob 7', icon: (<Blob7Icon data-test="blob-7" />: any) },
	{ id: 'Blob 8', icon: (<Blob8Icon data-test="blob-8" />: any) },
	{ id: 'Blob 9', icon: (<Blob9Icon data-test="blob-9" />: any) },
	{ id: 'Blob 10', icon: (<Blob10Icon data-test="blob-10" />: any) },
	{ id: 'Blob 11', icon: (<Blob11Icon data-test="blob-11" />: any) },
	{ id: 'Blob 12', icon: (<Blob12Icon data-test="blob-12" />: any) },
	{ id: 'Sketch 1', icon: (<Sketch1Icon data-test="sketch-1" />: any) },
	{ id: 'Sketch 2', icon: (<Sketch2Icon data-test="sketch-2" />: any) },
	{ id: 'Sketch 3', icon: (<Sketch3Icon data-test="sketch-3" />: any) },
	{ id: 'Sketch 4', icon: (<Sketch4Icon data-test="sketch-4" />: any) },
	{ id: 'Sketch 5', icon: (<Sketch5Icon data-test="sketch-5" />: any) },
	{ id: 'Sketch 6', icon: (<Sketch6Icon data-test="sketch-6" />: any) },
	{ id: 'Sketch 7', icon: (<Sketch7Icon data-test="sketch-7" />: any) },
	{ id: 'Sketch 8', icon: (<Sketch8Icon data-test="sketch-8" />: any) },
	{
		id: 'Paint Circle 1',
		icon: (<PaintCircle1Icon data-test="paint-circle-1" />: any),
	},
	{
		id: 'Paint Circle 2',
		icon: (<PaintCircle2Icon data-test="paint-circle-2" />: any),
	},
	{
		id: 'Paint Circle 3',
		icon: (<PaintCircle3Icon data-test="paint-circle-3" />: any),
	},
	{
		id: 'Paint Circle 4',
		icon: (<PaintCircle4Icon data-test="paint-circle-4" />: any),
	},
	{
		id: 'Splatter 1',
		icon: (<Splatter1Icon data-test="splatter-1" />: any),
	},
	{ id: 'Splatter 2', icon: (<Splatter2Icon data-test="splatter-2" />: any) },
	{ id: 'Splatter 3', icon: (<Splatter3Icon data-test="splatter-3" />: any) },
	{ id: 'Splatter 4', icon: (<Splatter4Icon data-test="splatter-4" />: any) },
	{ id: 'Circle', icon: (<CircleIcon data-test="circle" />: any) },
	{ id: 'Triangle', icon: (<TriangleIcon data-test="triangle" />: any) },
	{ id: 'Hexagon', icon: (<HexagonIcon data-test="hexagon" />: any) },
	{ id: 'Octagon', icon: (<OctagonIcon data-test="octagon" />: any) },
	{ id: 'Flower', icon: (<FlowerIcon data-test="flower" />: any) },
	{
		id: 'Multiplication',
		icon: (<MultiplicationIcon data-test="multiplication" />: any),
	},
	{ id: 'Star', icon: (<StarIcon data-test="star" />: any) },
	{ id: 'Stairs', icon: (<StairsIcon data-test="stairs" />: any) },
];

export const selectedShape = (selectedId: string): Object =>
	maskShapeIcons.find((item) => item.id === selectedId);
