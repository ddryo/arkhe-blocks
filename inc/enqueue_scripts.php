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

	$dist_url = ARKHE_BLOCKS_URL . 'dist/';

	// ブロック用CSS
	wp_enqueue_style( 'arkhe-blocks-style', $dist_url . 'css/blocks.css', [], ARKHE_BLOCKS_VERSION );

	// @FontAwesom
	$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/fa.asset.php';
	wp_enqueue_script( 'arkhe-blocks-fa', $dist_url . 'gutenberg/fa.js', $asset['dependencies'], $asset['version'], true );

	// コアブロックの拡張
	$is_ex_core = apply_filters( 'arkhe_blocks_is_ex_core', 1 );
	if ( $is_ex_core ) {
		$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/ex_core.asset.php';
		wp_enqueue_script( 'arkhe-blocks-ex_core', $dist_url . 'gutenberg/ex_core.js', $asset['dependencies'], $asset['version'], true );
	}

	// その他基本的なスクリプト
	$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/index.asset.php';
	wp_enqueue_script( 'arkhe-blocks-script', $dist_url . 'gutenberg/index.js', $asset['dependencies'], $asset['version'], true );

}


/**
 * エディター側の<html>に[data-sidebar]を付与( 投稿リストブロック用 )
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

	echo PHP_EOL . '<!-- Arkhe Blocks -->' . PHP_EOL;
	echo '<script>document.documentElement.setAttribute("data-sidebar", "' . $show_sidebar . '");</script>' . PHP_EOL; // phpcs:ignore
	echo '<!-- / Arkhe Blocks -->' . PHP_EOL;

}
