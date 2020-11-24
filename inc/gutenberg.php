<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

add_action( 'init', '\Arkhe_Blocks\register_blocks' );
add_filter( 'block_categories', '\Arkhe_Blocks\add_block_categories', 5 );


/**
 * ダイナミックブロック用ファイルの読み込み
 */
function register_blocks() {

	global $wp_version;
	$is_wp56 = ( version_compare( $wp_version, '5.6.RC1' ) >= 0 );

	// 翻訳登録用の空ファイル
	wp_enqueue_script(
		'arkhe-blocks-lang',
		ARKHE_BLOCKS_URL . 'assets/js/translations.js',
		[],
		ARKHE_BLOCKS_VERSION,
		false
	);

	// JS用翻訳ファイルの読み込み
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations(
			'arkhe-blocks-lang',
			'arkhe-blocks',
			ARKHE_BLOCKS_PATH . 'languages'
		);
	}

	// render_callback 不要な通常ブロック
	$arkhe_blocks = [
		'accordion',
		'accordion-item',
		'faq',
		'faq-item',
		'dl',
		'dl-dt',
		'dl-dd',
		'dl-div',
	];

	if ( \Arkhe_Blocks::IS_PRO ) {
		$arkhe_blocks_pro = [
			'notice', // freeへ？
			'step',
			'step-item',
			'timeline',
			'timeline-item',
		];

		if ( $is_wp56 ) {
			// apiv2 の β版
			$arkhe_blocks_pro[] = 'box-link';
			$arkhe_blocks_pro[] = 'box-links';
			$arkhe_blocks_pro[] = 'column';
			$arkhe_blocks_pro[] = 'columns';
		}

		$arkhe_blocks = array_merge( $arkhe_blocks, $arkhe_blocks_pro );
	}

	foreach ( $arkhe_blocks as $block_name ) {
		register_block_type_from_metadata(
			ARKHE_BLOCKS_PATH . 'src/blocks/' . $block_name
		);
	}

	if ( ! \Arkhe_Blocks::IS_PRO ) return;

	// ダイナミックブロックの読み込み
	$dynamic_blocks = [];

	if ( $is_wp56 ) {
		$dynamic_blocks[] = 'blog-card';
	}

	if ( IS_ARKHE_THEME ) {
		$dynamic_blocks[] = 'page-list';
		$dynamic_blocks[] = 'post-list';
		$dynamic_blocks[] = 'rss';
	}

	foreach ( $dynamic_blocks as $block_name ) {
		require_once __DIR__ . '/blocks/' . $block_name . '.php';
	}

}


/**
 * ブロックカテゴリー追加
 */
function add_block_categories( $categories ) {
	$my_category = [
		[
			'slug'  => 'arkhe-blocks',
			'title' => __( 'Arkhe Blocks', 'arkhe-blocks' ),
			'icon'  => null,
		],
	];
	array_splice( $categories, 3, 0, $my_category );
	return $categories;
}
