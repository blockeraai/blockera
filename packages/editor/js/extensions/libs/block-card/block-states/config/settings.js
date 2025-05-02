export const settings = {
	normal: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * When count of "normal" state equal with one item, this state should not deletable!
		 */
		min: 1,
		color: 'var(--blockera-controls-primary-color-bk)',
	},
	hover: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR:hover',
		color: 'var(--blockera-controls-states-color)',
	},
	active: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		//delete => enable
		cssSelector: '@SELECTOR:active',
		color: 'var(--blockera-controls-states-color)',
	},
	focus: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR:focus',
		color: 'var(--blockera-controls-states-color)',
	},
	visited: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR:visited',
		color: 'var(--blockera-controls-states-color)',
	},
	before: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR:before',
		color: 'var(--blockera-controls-states-color)',
	},
	after: {
		/**
		 * When count of "normal" state bigger than one item, other item of this state type is not visible!
		 */
		max: 1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR:after',
		color: 'var(--blockera-controls-states-color)',
	},
	'custom-class': {
		/**
		 * This state must be usually cloneable, visible and addable!
		 */
		max: -1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '@SELECTOR.className',
		color: 'var(--blockera-controls-states-color)',
	},
	'parent-class': {
		/**
		 * This state must be usually cloneable, visible and addable!
		 */
		max: -1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '#parentClientId @SELECTOR',
		color: 'var(--blockera-controls-states-color)',
	},
	'parent-hover': {
		/**
		 * This state must be usually cloneable, visible and addable!
		 */
		max: -1,
		/**
		 * This state must be usually deletable!
		 */
		min: 0,
		cssSelector: '#parentClientId:hover @SELECTOR',
		color: 'var(--blockera-controls-states-color)',
	},
};
