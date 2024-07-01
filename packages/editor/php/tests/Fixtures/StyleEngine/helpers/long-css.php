<?php

return [
	[
		'longCss' => 'margin-top: 10px;
    margin-right: 20px;
    margin-bottom: 10px;
    margin-left: 20px;
    padding-top: 5px;
    padding-right: 10px;
    padding-bottom: 5px;
    padding-left: 10px;',
		'expectedCss' => 'margin: 10px 20px 10px 20px; padding: 5px 10px 5px 10px;',
	],
	[
		'longCss' => 'margin-top: 10px !important;
    margin-right: 20px;
    margin-bottom: 10px;
    margin-left: 20px;
    padding-top: 5px;
    padding-right: 10px;
    padding-bottom: 5px;
    padding-left: 10px;',
		'expectedCss' => 'margin: 10px 20px 10px 20px !important; padding: 5px 10px 5px 10px;',
	]
];
