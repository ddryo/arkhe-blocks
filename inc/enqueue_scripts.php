<?php

namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * ファイルの読み込み
 */
add_action( 'wp_enqueue_scripts', '\Arkhe_Blocks\hook_wp_enqueue_scripts', 20 );
// add_action( 'admin_enqueue_scripts', '\Arkhe_Blocks\hook_admin_enqueue_scripts', 20 );
add_action( 'enqueue_block_editor_assets', '\Arkhe_Blocks\hook_enqueue_block_editor_assets', 20 );


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
function hook_admin_enqueue_scripts( $hook_suffix ) {

	// 管理画面側で読み込むスクリプト
	// wp_enqueue_script( 'arkhe-blocks-admin', ARKHE_BLOCKS_URL . 'dist/js/admin.js', ['jquery' ], ARKHE_BLOCKS_VERSION, true );
	// wp_enqueue_style( 'arkhe-blocks-admin', ARKHE_BLOCKS_URL . 'dist/css/admin.css', [], ARKHE_BLOCKS_VERSION );

	// ページの種類で分岐
	// if ( 'post.php' === $hook_suffix || 'post-new.php' === $hook_suffix ) {
	// }
}


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

	$asset = include ARKHE_BLOCKS_PATH . 'dist/blocks/index.asset.php';
	wp_enqueue_script(
		'arkhe-blocks-script',
		ARKHE_BLOCKS_URL . 'dist/blocks/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);
}
