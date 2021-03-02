<?php
namespace Arkhe_Blocks\Menu;

defined( 'ABSPATH' ) || exit;

// PAGE_NAME
$db_name   = 'general';
$page_name = \Arkhe_Blocks::MENU_PAGE_PREFIX . $db_name;

\Arkhe_Blocks::add_menu_section( [
	'title'     => __( 'Disable editor extensions', 'arkhe-blocks' ),
	'key'       => 'disable_function',
	'page_name' => $page_name,
	'db'        => $db_name,
	'page_cb'   => '\Arkhe_Blocks\Menu\cb_general',
] );

function cb_general( $args ) {
	$settings = [
		'disable_ex_core'          => __( 'Disable core block extensions', 'arkhe-blocks' ),
		'disable_format'           => __( 'Disable format extensions', 'arkhe-blocks' ),
		// 'disable_shortcode'        => __( 'ショートコード呼び出し機能を無効化する', 'arkhe-blocks' ),
		'disable_header_link'      => __( 'Hide the link to the page placed on the header toolbar', 'arkhe-blocks' ),
	];
	foreach ( $settings as $key => $label ) {
		\Arkhe_Blocks::output_checkbox([
			'db'    => $args['db'],
			'key'   => $key,
			'label' => $label,
		]);
	}
}
