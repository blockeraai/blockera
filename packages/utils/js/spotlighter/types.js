// @flow

export type Target = string | {| current: ?HTMLElement |};

export type Options = {|
	color?: string, // overlay colour         (default '#000')
	opacity?: number, // 0-1 darkness           (default 0.9)
	padding?: number, // px around spotlight    (default 0)
	radius?: number, // px corner radius       (default 0)
	passThrough?: boolean, // child clickable?       (default false)
	active?: boolean, // master switch          (default true)
	onClickOutside?: (ev: MouseEvent) => mixed, // callback on outside clicks
|};
