// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';

export type TBlockeraBlockVariation = {
	name: string,
	title: string,
	description?: string,
	icon?: ComponentType<any> | string,
	attributes?: { [string]: any },
};

export type TBlockeraBlockType = {
	name: string,
	title: string,
	description?: string,
	category?: string,
	icon?: ComponentType<any> | string,
	keywords?: Array<string>,
	attributes?: { [string]: any },
	save?: ComponentType<any>,
	edit: ComponentType<any>,
	variations?: Array<TBlockeraBlockVariation>,
	example?: Object,
};
