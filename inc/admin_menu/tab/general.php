<?php
namespace Arkhe_Blocks\Menu;

defined( 'ABSPATH' ) || exit;

// PAGE_NAME
$db_name   = 'general';
$page_name = \Arkhe_Blocks::MENU_PAGE_PREFIX . $db_name;

\Arkhe_Blocks::add_menu_section( [
	'title'     => __( 'Disable editor function', 'arkhe-blocks' ), // エディター機能の無効化
	'key'       => 'disable_function',
	'page_name' => $page_name,
	'db'        => $db_name,
	'page_cb'   => '\Arkhe_Blocks\Menu\cb_general',
] );

function cb_general( $args ) {
	$settings = [
		'disable_ex_core'          => __( 'コアブロック拡張機能を無効化する', 'arkhe-blocks' ),
		'disable_format'           => __( 'フォーマット拡張機能を無効化する', 'arkhe-blocks' ),
		// 'disable_shortcode'        => __( 'ショートコード呼び出し機能を無効化する', 'arkhe-blocks' ),
		'disable_header_link'      => __( 'ヘッダーツールバーに設置しているページへのリンクを非表示にする', 'arkhe-blocks' ),
	];
	foreach ( $settings as $key => $label ) {
		\Arkhe_Blocks::output_checkbox([
			'db'    => $args['db'],
			'key'   => $key,
			'label' => $label,
		]);
	}
}
