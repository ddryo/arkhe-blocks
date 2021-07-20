<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;


/**
 * フロントで読み込むファイル
 */
add_action( 'wp_enqueue_scripts', '\Arkhe_Blocks\hook_wp_enqueue_scripts' );
function hook_wp_enqueue_scripts() {
	wp_enqueue_style( 'arkhe-blocks-front', ARKHE_BLOCKS_URL . 'dist/css/front.css', [], \Arkhe_Blocks::$file_ver );

	// カスタムフォーマット用CSS
	$custom_format_css = \Arkhe_Blocks::get_data( 'format', 'custom_format_css' );
	if ( $custom_format_css ) {
		wp_add_inline_style( 'arkhe-blocks-front', $custom_format_css );
	}

}


/**
 * フロントで読み込むファイル (at footer)
 */
add_action( 'wp_footer', '\Arkhe_Blocks\hook_enqueue_footer', 1 );
function hook_enqueue_footer() {

	if ( \Arkhe_Blocks::is_use( 'ol_start' ) ) {
		wp_enqueue_script( 'arkhe-blocks-ol-start', ARKHE_BLOCKS_URL . 'dist/js/ol_start.js', [], \Arkhe_Blocks::$file_ver, true );
	}

	// swiper
	if ( \Arkhe_Blocks::is_use( 'swiper' ) ) {
		wp_enqueue_style( 'arkhe-blocks-swiper', ARKHE_BLOCKS_URL . 'assets/css/swiper.min.css', [], \Arkhe_Blocks::$file_ver );
		wp_enqueue_script( 'arkhe-blocks-swiper', ARKHE_BLOCKS_URL . 'assets/js/swiper.min.js', [], \Arkhe_Blocks::$file_ver, true );
		wp_enqueue_script( 'arkhe-blocks-slider-swiper', ARKHE_BLOCKS_URL . 'dist/gutenberg/blocks/slider/script.js', ['arkhe-blocks-swiper' ], \Arkhe_Blocks::$file_ver, true );
	}

	// memo: ハンドル名はblock.jsonでの自動読み込み時と同じにしてる
	if ( \Arkhe_Blocks::is_use( 'tab' ) ) {
		wp_enqueue_script( 'arkhe-blocks-tab-script', ARKHE_BLOCKS_URL . 'dist/gutenberg/blocks/tab/script.js', [], \Arkhe_Blocks::$file_ver, true );
	}
	if ( \Arkhe_Blocks::is_use( 'accordion' ) ) {
		wp_enqueue_script( 'arkhe-blocks-accordion-script', ARKHE_BLOCKS_URL . 'dist/gutenberg/blocks/accordion/script.js', [], \Arkhe_Blocks::$file_ver, true );
	}
}


/**
 * Gutenberg用ファイル
 */
add_action( 'enqueue_block_editor_assets', '\Arkhe_Blocks\hook_enqueue_block_editor_assets', 20 );
function hook_enqueue_block_editor_assets( $hook_suffix ) {

	$dist_url = ARKHE_BLOCKS_URL . 'dist/';

	// ブロック用CSS
	wp_enqueue_style( 'arkhe-blocks-editor', $dist_url . 'css/blocks.css', [], \Arkhe_Blocks::$file_ver );

	// カスタムフォーマット用CSS
	$custom_format_css = \Arkhe_Blocks::get_data( 'format', 'custom_format_css' );
	if ( $custom_format_css ) {
		wp_add_inline_style( 'arkhe-blocks-editor', $custom_format_css );
	}

	// 基本スクリプト
	$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/index.asset.php';
	wp_enqueue_script( 'arkhe-blocks-editor', $dist_url . 'gutenberg/index.js', $asset['dependencies'], $asset['version'], true );
	wp_localize_script( 'arkhe-blocks-editor', 'arkbVars', [
		'isArkhe' => IS_ARKHE_THEME,
	] );

	// @FontAwesom
	$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/fa.asset.php';
	wp_enqueue_script( 'arkhe-blocks-fa', $dist_url . 'gutenberg/fa.js', $asset['dependencies'], $asset['version'], true );

	// コアブロックの拡張
	if ( ! \Arkhe_Blocks::get_data( 'general', 'disable_ex_core' ) ) {
		$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/ex_core.asset.php';
		wp_enqueue_script( 'arkhe-blocks-ex-core', $dist_url . 'gutenberg/ex_core.js', $asset['dependencies'], $asset['version'], true );
	}

	// 書式フォーマットの拡張
	if ( ! \Arkhe_Blocks::get_data( 'general', 'disable_format' ) ) {
		$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/format.asset.php';
		wp_enqueue_script( 'arkhe-blocks-format', $dist_url . 'gutenberg/format.js', $asset['dependencies'], $asset['version'], true );
	}

}


/**
 * 管理画面で読み込むファイル
 */
add_action( 'admin_enqueue_scripts', '\Arkhe_Blocks\hook_admin_enqueue_scripts', 21 );
function hook_admin_enqueue_scripts( $hook_suffix ) {

	$is_arkb_page = strpos( $hook_suffix, \Arkhe_Blocks::MENU_SLUG ) !== false;

	// Arkhe Blocks設定ページのみ
	if ( $is_arkb_page ) {
		wp_enqueue_style( 'arkhe-blocks-menu', ARKHE_BLOCKS_URL . 'dist/css/menu.css', [], \Arkhe_Blocks::$file_ver );

		wp_dequeue_style( 'arkhe-toolkit-menu' );

		// codemirror
		// see: https://codemirror.net/doc/manual.html#config
		$codemirror = [
			'tabSize'           => 4,
			'indentUnit'        => 4,
			'indentWithTabs'    => true,
			'inputStyle'        => 'contenteditable',
			'lineNumbers'       => true,
			'smartIndent'       => true,
			'lineWrapping'      => true, // 横長のコードを折り返すかどうか
			'autoCloseBrackets' => true,
			'styleActiveLine'   => true,
			'continueComments'  => true,
			// 'extraKeys'         => [],
		];

		$settings = wp_enqueue_code_editor( [
			'type'       => 'text/css',
			'codemirror' => $codemirror,
		] );

		wp_localize_script( 'wp-theme-plugin-editor', 'codeEditorSettings', $settings );
		wp_enqueue_script( 'wp-theme-plugin-editor' );
		wp_add_inline_script(
			'wp-theme-plugin-editor',
			'jQuery(document).ready(function($) {
				var arkbCssEditor = $(".arkb-css-editor");
				if(arkbCssEditor.length < 1) return;
				wp.codeEditor.initialize($(".arkb-css-editor"), codeEditorSettings );
			})'
		);
		wp_enqueue_style( 'wp-codemirror' );
	}
}



/**
 * adminのheadに追加する処理
 */
add_action( 'admin_head', '\Arkhe_Blocks\hook_admin_head', 20 );
function hook_admin_head() {

	$output_code = get_admin_head_code();
	if ( ! $output_code ) return;

	echo PHP_EOL . '<!-- Arkhe Blocks -->' . PHP_EOL;
	echo $output_code; // phpcs:ignore
	echo '<!-- / Arkhe Blocks -->' . PHP_EOL;

}

function get_admin_head_code() {

	$output_code = '';

	// 管理メニュー用CSS
	$output_code .= '<style>.toplevel_page_arkhe_blocks_settings .wp-menu-image img {' .
		'width: 20px; height: 20px; padding-top: 6px!important;' .
	'}</style>' . PHP_EOL;

	// ここからはブロックエディターのみ。
	$is_block_editor = get_current_screen()->is_block_editor();
	if ( $is_block_editor ) $output_code;

	// さらに、Arkheテーマでのみ追加する処理
	if ( ! class_exists( 'Arkhe' ) ) return $output_code;

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

	// エディター側の<html>に[data-sidebar]を付与( 投稿リストブロック用 )
	$output_code .= '<script>document.documentElement.setAttribute("data-sidebar", "' . $show_sidebar . '");</script>' . PHP_EOL;

	return $output_code;
}
