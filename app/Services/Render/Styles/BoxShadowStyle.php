<?php

namespace Publisher\Framework\Services\Render\Styles;

class BoxShadowStyle extends RepeaterStyle {

	protected function getId():string {

		return 'publisherBoxShadow';
	}

	protected function getCssProp():string {

		return 'box-shadow';
	}
}

