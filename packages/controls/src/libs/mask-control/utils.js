// @flow

/**
 * Internal dependencies
 */
import Blob1Icon from './icons/shapes/blob-1';
import Blob2Icon from './icons/shapes/blob-2';
import Blob3Icon from './icons/shapes/blob-3';
import Blob4Icon from './icons/shapes/blob-4';
import Blob5Icon from './icons/shapes/blob-5';
import Blob6Icon from './icons/shapes/blob-6';
import Blob7Icon from './icons/shapes/blob-7';
import Blob8Icon from './icons/shapes/blob-8';
import Blob9Icon from './icons/shapes/blob-9';
import Blob10Icon from './icons/shapes/blob-10';
import Blob11Icon from './icons/shapes/blob-11';
import Blob12Icon from './icons/shapes/blob-12';
import Sketch1Icon from './icons/shapes/sketch-1';
import Sketch2Icon from './icons/shapes/sketch-2';
import Sketch3Icon from './icons/shapes/sketch-3';
import Sketch4Icon from './icons/shapes/sketch-4';
import Sketch5Icon from './icons/shapes/sketch-5';
import Sketch6Icon from './icons/shapes/sketch-6';
import Sketch7Icon from './icons/shapes/sketch-7';
import Sketch8Icon from './icons/shapes/sketch-8';
import PaintCircle1Icon from './icons/shapes/paint-circle-1';
import PaintCircle2Icon from './icons/shapes/paint-circle-2';
import PaintCircle3Icon from './icons/shapes/paint-circle-3';
import PaintCircle4Icon from './icons/shapes/paint-circle-4';
import Splatter1Icon from './icons/shapes/splatter-1';
import Splatter2Icon from './icons/shapes/splatter-2';
import Splatter3Icon from './icons/shapes/splatter-3';
import Splatter4Icon from './icons/shapes/splatter-4';
import CircleIcon from './icons/shapes/circle';
import TriangleIcon from './icons/shapes/triangle';
import HexagonIcon from './icons/shapes/hexagon';
import OctagonIcon from './icons/shapes/octagon';
import FlowerIcon from './icons/shapes/flower';
import MultiplicationIcon from './icons/shapes/multiplication';
import StarIcon from './icons/shapes/star';
import StairsIcon from './icons/shapes/stairs';

export const maskShapeIcons = [
	{ id: 'Blob 1', icon: (<Blob1Icon />: any) },
	{ id: 'Blob 2', icon: (<Blob2Icon />: any) },
	{ id: 'Blob 3', icon: (<Blob3Icon />: any) },
	{ id: 'Blob 4', icon: (<Blob4Icon />: any) },
	{ id: 'Blob 5', icon: (<Blob5Icon />: any) },
	{ id: 'Blob 6', icon: (<Blob6Icon />: any) },
	{ id: 'Blob 7', icon: (<Blob7Icon />: any) },
	{ id: 'Blob 8', icon: (<Blob8Icon />: any) },
	{ id: 'Blob 9', icon: (<Blob9Icon />: any) },
	{ id: 'Blob 10', icon: (<Blob10Icon />: any) },
	{ id: 'Blob 11', icon: (<Blob11Icon />: any) },
	{ id: 'Blob 12', icon: (<Blob12Icon />: any) },
	{ id: 'Sketch 1', icon: (<Sketch1Icon />: any) },
	{ id: 'Sketch 2', icon: (<Sketch2Icon />: any) },
	{ id: 'Sketch 3', icon: (<Sketch3Icon />: any) },
	{ id: 'Sketch 4', icon: (<Sketch4Icon />: any) },
	{ id: 'Sketch 5', icon: (<Sketch5Icon />: any) },
	{ id: 'Sketch 6', icon: (<Sketch6Icon />: any) },
	{ id: 'Sketch 7', icon: (<Sketch7Icon />: any) },
	{ id: 'Sketch 8', icon: (<Sketch8Icon />: any) },
	{ id: 'Paint Circle 1', icon: (<PaintCircle1Icon />: any) },
	{ id: 'Paint Circle 2', icon: (<PaintCircle2Icon />: any) },
	{ id: 'Paint Circle 3', icon: (<PaintCircle3Icon />: any) },
	{ id: 'Paint Circle 4', icon: (<PaintCircle4Icon />: any) },
	{ id: 'Splatter 1', icon: (<Splatter1Icon />: any) },
	{ id: 'Splatter 2', icon: (<Splatter2Icon />: any) },
	{ id: 'Splatter 3', icon: (<Splatter3Icon />: any) },
	{ id: 'Splatter 4', icon: (<Splatter4Icon />: any) },
	{ id: 'Circle', icon: (<CircleIcon />: any) },
	{ id: 'Triangle', icon: (<TriangleIcon />: any) },
	{ id: 'Hexagon', icon: (<HexagonIcon />: any) },
	{ id: 'Octagon', icon: (<OctagonIcon />: any) },
	{ id: 'Flower', icon: (<FlowerIcon />: any) },
	{ id: 'Multiplication', icon: (<MultiplicationIcon />: any) },
	{ id: 'Star', icon: (<StarIcon />: any) },
	{ id: 'Stairs', icon: (<StairsIcon />: any) },
];

export const selectedShape = (selectedId: string): Object =>
	maskShapeIcons.find((item) => item.id === selectedId);
