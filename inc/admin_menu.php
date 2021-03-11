<?php
namespace Arkhe_Blocks\Menu;

defined( 'ABSPATH' ) || exit;

/**
 * 管理画面に独自メニューを追加
 */
add_action( 'admin_menu', function () {

	$arkhe_menu_title = 'Arkhe Blocks';

	// 設定ページを追加
	add_menu_page(
		$arkhe_menu_title, // ページタイトルタグ
		$arkhe_menu_title, // メニュータイトル
		'manage_options',  // 必要な権限
		\Arkhe_Blocks::MENU_SLUG, // このメニューを参照するスラッグ名
		'\Arkhe_Blocks\Menu\display_setting_page', // 表示内容
		ARKHE_BLOCKS_URL . 'assets/img/arkhe-menu-icon.png', // アイコン
		29 // 管理画面での表示位置 Toolkit と同じ
	);

	// トップメニュー複製
	add_submenu_page(
		\Arkhe_Blocks::MENU_SLUG,
		$arkhe_menu_title,
		$arkhe_menu_title,
		'manage_options',
		\Arkhe_Blocks::MENU_SLUG,
		'\Arkhe_Blocks\Menu\display_setting_page'
	);
}, 11 );


/**
 * 設定ページの内容
 */
function display_setting_page() {
	require_once ARKHE_BLOCKS_PATH . 'inc/admin_menu/menu_page.php';
}


/**
 * 設定の追加
 */
add_action( 'admin_init', function() {

	$menu_tabs = [
		'general'   => __( 'General settings', 'arkhe-blocks' ),
	];
	if ( \Arkhe_Blocks::IS_PRO ) {
		$menu_tabs['format'] = _x( 'Format', 'tab', 'arkhe-blocks' );
		// $menu_tabs['shortcode'] = _x( 'Shortcode', 'tab', 'arkhe-blocks' );
	}

	\Arkhe_Blocks::$menu_tabs = $menu_tabs;

	foreach ( $menu_tabs as $key => $value ) {

		register_setting( \Arkhe_Blocks::MENU_GROUP_PREFIX . $key, \Arkhe_Blocks::DB_NAMES[ $key ] );
		require_once ARKHE_BLOCKS_PATH . 'inc/admin_menu/tab/' . $key . '.php';

	}
} );
