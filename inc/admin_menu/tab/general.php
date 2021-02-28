<?php
namespace Arkhe_Blocks\Menu;

defined( 'ABSPATH' ) || exit;

// PAGE_NAME
$db_name   = 'general';
$page_name = \Arkhe_Blocks::MENU_PAGE_PREFIX . $db_name;

\Arkhe_Blocks::add_menu_section( [
	'title'     => __( '機能設定', 'arkhe-blocks' ),
	'key'       => 'general',
	'page_name' => $page_name,
	'db'        => $db_name,
	'page_cb'   => '\Arkhe_Blocks\Menu\cb_general',
] );

function cb_general( $args ) {
	$settings = [
		'test'  => __( 'Cache header', 'arkhe-blocks' ),
		'test2' => __( 'Cache sidebar', 'arkhe-blocks' ),
	];
	foreach ( $settings as $key => $label ) {
		\Arkhe_Blocks::output_checkbox([
			'db'    => $args['db'],
			'key'   => $key,
			'label' => $label,
		]);
	}
}
