<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * ファイルの読み込み
 */
add_action( 'wp_enqueue_scripts', '\Arkhe_Blocks\hook_wp_enqueue_scripts', 20 );
add_action( 'admin_enqueue_scripts', '\Arkhe_Blocks\hook_admin_enqueue_scripts', 20 );
add_action( 'enqueue_block_editor_assets', '\Arkhe_Blocks\hook_enqueue_block_editor_assets', 20 );
add_action( 'admin_head', '\Arkhe_Blocks\hook_admin_head', 20 );


/**
 * フロントで読み込むファイル
 */
function hook_wp_enqueue_scripts() {
	wp_enqueue_style( 'arkhe-blocks-front', ARKHE_BLOCKS_URL . 'dist/css/front.css', [], ARKHE_BLOCKS_VERSION );
	wp_enqueue_script( 'arkhe-blocks-front', ARKHE_BLOCKS_URL . 'dist/js/front.js', [], ARKHE_BLOCKS_VERSION, true );

	// カスタムフォーマット用CSS
	$custom_format_css = \Arkhe_Blocks::get_data( 'format', 'custom_format_css' );
	if ( $custom_format_css ) {
		wp_add_inline_style( 'arkhe-blocks-front', $custom_format_css );
	}
}


/**
 * Gutenberg用ファイル
 */
function hook_enqueue_block_editor_assets( $hook_suffix ) {

	$dist_url = ARKHE_BLOCKS_URL . 'dist/';

	// ブロック用CSS
	wp_enqueue_style( 'arkhe-blocks-editor', $dist_url . 'css/blocks.css', [], ARKHE_BLOCKS_VERSION );

	// カスタムフォーマット用CSS
	$custom_format_css = \Arkhe_Blocks::get_data( 'format', 'custom_format_css' );
	if ( $custom_format_css ) {
		wp_add_inline_style( 'arkhe-blocks-editor', $custom_format_css );
	}

	// 基本スクリプト
	$asset = include ARKHE_BLOCKS_PATH . 'dist/gutenberg/index.asset.php';
	wp_enqueue_script( 'arkhe-blocks-editor', $dist_url . 'gutenberg/index.js', $asset['dependencies'], $asset['version'], true );

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
function hook_admin_enqueue_scripts( $hook_suffix ) {

	$is_arkb_page = strpos( $hook_suffix, 'arkhe_blocks_settings' ) !== false;

	// Arkhe Blocks設定ページのみ
	if ( $is_arkb_page ) {
		wp_enqueue_style( 'arkhe-blocks-menu', ARKHE_BLOCKS_URL . 'dist/css/menu.css', [], ARKHE_BLOCKS_VERSION );

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
				wp.codeEditor.initialize($(".arkb-css-editor"), codeEditorSettings );
			})'
		);
		wp_enqueue_style( 'wp-codemirror' );
	}
}



/**
 * adminのheadに追加する処理
 */
function hook_admin_head() {

	$is_block_editor = get_current_screen()->is_block_editor();
	if ( $is_block_editor ) return;

	$output_code = '';

	// Arkheテーマでのみ追加する処理
	if ( class_exists( 'Arkhe' ) ) {

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

		$output_code .= '<script>document.documentElement.setAttribute("data-sidebar", "' . $show_sidebar . '");</script>' . PHP_EOL;
	}

	if ( '' === $output_code ) return;

	// エディター側の<html>に[data-sidebar]を付与( 投稿リストブロック用 )
	echo PHP_EOL . '<!-- Arkhe Blocks -->' . PHP_EOL;
	echo $output_code; // phpcs:ignore
	echo '<!-- / Arkhe Blocks -->' . PHP_EOL;

}
