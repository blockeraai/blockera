<?php

require_once __DIR__ . '/plugin-helpers.php';


switch ( $argv[1] ) {

	case 'type=version':
		echo get_plugin_version();
		break;

	case 'type=changelog':
		print_changelog();
		break;

	case 'type=php_ver':
		echo get_php_version();
		break;

	case 'type=get_required_ver':
		echo get_required_version();
		break;

	case 'type=tested_ver':
		echo get_tested_version();
		break;

	case 'type=short_desc':
		echo get_short_description();
		break;
}
