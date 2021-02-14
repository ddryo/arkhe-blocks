<?php

namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * ファイルの読み込み
 */
add_action( 'wp_enqueue_scripts', '\Arkhe_Blocks\hook_wp_enqueue_scripts', 20 );
// add_action( 'admin_enqueue_scripts', '\Arkhe_Blocks\hook_admin_enqueue_scripts', 20 );
add_action( 'enqueue_block_editor_assets', '\Arkhe_Blocks\hook_enqueue_block_editor_assets', 20 );
add_action( 'admin_head', '\Arkhe_Blocks\hook_admin_head', 20 );


/**
 * フロントで読み込むファイル
 */
function hook_wp_enqueue_scripts() {
	wp_enqueue_style( 'arkhe-blocks-front', ARKHE_BLOCKS_URL . 'dist/css/front.css', [], ARKHE_BLOCKS_VERSION );
	wp_enqueue_script( 'arkhe-blocks-front', ARKHE_BLOCKS_URL . 'dist/js/front.js', [], ARKHE_BLOCKS_VERSION, true );
}


/**
 * 管理画面で読み込むファイル
 */
// function hook_admin_enqueue_scripts( $hook_suffix ) {}


/**
 * Gutenberg用ファイル
 */
function hook_enqueue_block_editor_assets( $hook_suffix ) {
	wp_enqueue_style(
		'arkhe-blocks-style',
		ARKHE_BLOCKS_URL . 'dist/css/blocks.css',
		[],
		ARKHE_BLOCKS_VERSION
	);

	// @FontAwesom
	$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/fa.asset.php';
	wp_enqueue_script(
		'arkhe-blocks-fa',
		ARKHE_BLOCKS_URL . 'dist/gutenberg/fa.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	// コアの拡張
	$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/ex_core.asset.php';
	wp_enqueue_script(
		'arkhe-blocks-ex_core',
		ARKHE_BLOCKS_URL . 'dist/gutenberg/ex_core.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	// その他基本的なスクリプト
	$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/index.asset.php';
	wp_enqueue_script(
		'arkhe-blocks-script',
		ARKHE_BLOCKS_URL . 'dist/gutenberg/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	// その他基本的なスクリプト
	$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/index.asset.php';
	wp_enqueue_script(
		'arkhe-blocks-script',
		ARKHE_BLOCKS_URL . 'dist/gutenberg/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);
}


/**
 * ページテンプレートの情報などをhtmlタグに。
 */
function hook_admin_head() {

	if ( ! class_exists( 'Arkhe' ) ) return;

	global $post_id; // 新規追加時は null
	global $post_type;

	$front_id      = (int) get_option( 'page_on_front' );
	$page_template = basename( get_page_template_slug() ) ?: '';

	if ( false !== strpos( $page_template, 'one-column' ) ) {
		$show_sidebar = 'off';
	} elseif ( 'two-column.php' === $page_template ) {
		$show_sidebar = 'on';
	} else {
		// デフォルトテンプレート時
		if ( $front_id === $post_id ) {
			$side_key = 'show_sidebar_top';
		} elseif ( 'page' === $post_type ) {
			$side_key = 'show_sidebar_page';
		} else {
			$side_key = 'show_sidebar_post';
		}
		$show_sidebar = \Arkhe::get_setting( $side_key ) ? 'on' : 'off';
	}
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo '<script>document.documentElement.setAttribute("data-sidebar", "' . $show_sidebar . '");</script>';

}
