<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * ダイナミックブロック用ファイルの読み込み
 */
add_action( 'init', '\Arkhe_Blocks\register_blocks' );
function register_blocks() {

	global $wp_version;
	$is_wp56 = ( version_compare( $wp_version, '5.6.RC1' ) >= 0 );
	if ( ! $is_wp56 ) return;

	// 翻訳登録用の空ファイル
	wp_enqueue_script( 'arkhe-blocks-lang', ARKHE_BLOCKS_URL . 'assets/js/translations.js', [], ARKHE_BLOCKS_VERSION, false );

	// JS用翻訳ファイルの読み込み
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'arkhe-blocks-lang', 'arkhe-blocks', ARKHE_BLOCKS_PATH . 'languages' );
	}

	// その他、グローバル変数も紐づけておく
	wp_localize_script( 'arkhe-blocks-lang', 'arkbSettings', \Arkhe_Blocks\get_localize_vars() );

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
		'notice',
	];

	// Pro版のみ
	if ( \Arkhe_Blocks::IS_PRO ) {
		$arkhe_blocks_pro = [
			'step',
			'step-item',
			'timeline',
			'timeline-item',
		];

		// かつ、Arkheでのみ利用可能
		if ( IS_ARKHE_THEME ) {
			$arkhe_blocks_pro[] = 'section';
			$arkhe_blocks_pro[] = 'section-heading';
			$arkhe_blocks_pro[] = 'box-link';
			$arkhe_blocks_pro[] = 'box-links';
			$arkhe_blocks_pro[] = 'column';
			$arkhe_blocks_pro[] = 'columns';
			$arkhe_blocks_pro[] = 'tab';
			$arkhe_blocks_pro[] = 'tab-body';
		}

		$arkhe_blocks = array_merge( $arkhe_blocks, $arkhe_blocks_pro );
	}

	foreach ( $arkhe_blocks as $block_name ) {
		register_block_type_from_metadata(
			ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/' . $block_name
		);
	}

	if ( ! \Arkhe_Blocks::IS_PRO ) return;

	// ダイナミックブロックの読み込み
	$dynamic_blocks = [];

	if ( IS_ARKHE_THEME ) {
		$dynamic_blocks[] = 'page-list';
		$dynamic_blocks[] = 'post-list';
		$dynamic_blocks[] = 'blog-card';
		$dynamic_blocks[] = 'rss';
	}

	foreach ( $dynamic_blocks as $block_name ) {
		require_once __DIR__ . '/blocks/' . $block_name . '.php';
	}

}


/**
 * ブロックカテゴリー追加
 */
add_filter( 'block_categories', '\Arkhe_Blocks\add_block_categories', 5 );
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


/**
 * ブロックエディターで使うグローバル変数
 */
function get_localize_vars() {
	$custom_formats = [];
	if ( \Arkhe_Blocks::IS_PRO ) {
		for ( $i = 1; $i < 4; $i++ ) {
			$format_title = \Arkhe_Blocks::get_data( 'format', 'format_title_' . $i );
			// $format_class = \Arkhe_Blocks::get_data( 'format', 'format_class_' . $i );
			if ( $format_title ) {
				$custom_formats[] = [
					'name'      => 'arkhe-blocks/custom' . $i,
					'title'     => $format_title,
					'tagName'   => 'span',
					'className' => 'arkb-format-' . $i,
				];
			}
		}
	}

	return [
		'customFormats'     => apply_filters( 'arkhe_blocks_custom_formats', $custom_formats ),
		'disableHeaderLink' => \Arkhe_Blocks::get_data( 'general', 'disable_header_link' ),
	];
}
