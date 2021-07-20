<?php
namespace Arkhe_Blocks\Gutenberg;

defined( 'ABSPATH' ) || exit;

/**
 * ブロックの読み込み
 */
add_action( 'init', __NAMESPACE__ . '\register_blocks' );
function register_blocks() {

	// 翻訳登録用の空ファイル
	wp_enqueue_script( 'arkhe-blocks-lang', ARKHE_BLOCKS_URL . 'assets/js/translations.js', [], \Arkhe_Blocks::$file_ver, false );

	// JS用翻訳ファイルの読み込み
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'arkhe-blocks-lang', 'arkhe-blocks', ARKHE_BLOCKS_PATH . 'languages' );
	}

	// その他、グローバル変数も紐づけておく
	wp_localize_script( 'arkhe-blocks-lang', 'arkbSettings', get_localize_arkb_vars() );

	register_arkhe_blocks();
	register_arkhe_dynamic_blocks();

	// style切り分けてるブロック
	$blocks = [
		'accordion',
		'notice',
	];
	$deps   = is_admin() ? 'arkhe-blocks-editor' : 'arkhe-blocks-front';
	foreach ( $blocks as $name ) {
		wp_register_style(
			"arkhe-blocks-{$name}-style",
			ARKHE_BLOCKS_URL . "dist/gutenberg/blocks/{$name}/index.css",
			[ $deps ],
			\Arkhe_Blocks::$file_ver
		);
	}
}


/**
 * ブロックエディターで使うグローバル変数
 */
function get_localize_arkb_vars() {
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


/**
 * 通常ブロックの読み込み
 */
function register_arkhe_blocks() {

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
		'section-heading',
	];

	// Proブロック
	if ( \Arkhe_Blocks::IS_PRO ) {
		$arkhe_blocks_pro = [
			'box-link',
			'box-links',
			'column',
			'columns',
			'step',
			'step-item',
			'tab',
			'tab-body',
			'timeline',
			'timeline-item',
		];

		// Arkheでのみ利用可能なProブロック
		// if ( IS_ARKHE_THEME ) {}

		$arkhe_blocks = array_merge( $arkhe_blocks, $arkhe_blocks_pro );
	}

	foreach ( $arkhe_blocks as $block_name ) {
		register_block_type_from_metadata( ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/' . $block_name );
	}
}


/**
 * ダイナミックブロックの読み込み
 */
function register_arkhe_dynamic_blocks() {

	$dynamic_blocks = [
		'section',
	];

	if ( \Arkhe_Blocks::IS_PRO ) {
		$dynamic_blocks_pro = [
			'slider',
			'slider-item',
		];

		// Arkheでのみ利用可能なダイナミックブロック
		if ( IS_ARKHE_THEME ) {
			$dynamic_blocks_pro[] = 'page-list';
			$dynamic_blocks_pro[] = 'post-list';
			$dynamic_blocks_pro[] = 'blog-card';
			$dynamic_blocks_pro[] = 'rss';
		}

		$dynamic_blocks = array_merge( $dynamic_blocks, $dynamic_blocks_pro );
	}

	foreach ( $dynamic_blocks as $block_name ) {
		require_once __DIR__ . '/blocks/' . $block_name . '.php';
	}
}


/**
 * ブロックカテゴリー追加
 */
$hookname = \Arkhe_Blocks::wpver_is_above( '5.8' ) ? 'block_categories_all' : 'block_categories';
add_filter( $hookname, __NAMESPACE__ . '\add_block_categories', 5 );
function add_block_categories( $categories ) {
	$my_category = [
		[
			'slug'  => 'arkhe-blocks',
			'title' => __( 'Arkhe Blocks', 'arkhe-blocks' ),
			'icon'  => null,
		],
	];

	// ウィジェットの前にカテゴリーを追加する
	foreach ( $categories as $index => $data ) {
		$slug = $data['slug'] ?? '';
		if ( 'widgets' === $slug ) {
			array_splice( $categories, $index, 0, $my_category );
			break;
		}
	}

	return $categories;
}
