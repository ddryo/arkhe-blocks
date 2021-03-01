<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

class Data {

	// 設定データを保持する変数
	protected static $data     = [];
	protected static $defaults = [];

	// DB名
	const DB_NAMES = [
		'general'   => 'arkhe_blocks_general',
		'format'    => 'arkhe_blocks_format',
		'shortcode' => 'arkhe_blocks_shortcode',
	];

	// 設定ページスラッグ
	const MENU_SLUG         = 'arkhe_blocks_settings';
	const MENU_PAGE_PREFIX  = 'arkb_menu_page_';
	const MENU_GROUP_PREFIX = 'arkb_menu_group_';

	// メニューの設定タブ
	public static $menu_tabs = [];

	// JSの読み込みを制御する変数
	// public static $use_swiper = false;

	// 外部からインスタンス化させない
	private function __construct() {}

	// init()
	public static function init() {

		// 設定データセット
		add_action( 'after_setup_theme', [ '\Arkhe_Blocks', 'data_init' ], 9 );
	}


	/**
	 * デフォルト値をセット
	 */
	private static function set_defaults() {

		self::$defaults = [
			'general' => [
				'disable_ex_core'     => '',
				'disable_format'      => '',
				'disable_shortcode'   => '',
				'disable_header_link' => '',
			],
			'format' => [
				'custom_format_css'   => '',
			],
			'shortcode' => [
				// 'custom_format_css'   => '',
			],
		];
	}


	/**
	 * 設定データの初期セット
	 */
	public static function data_init() {

		// デフォルト値をセット
		self::set_defaults();

		// 保存済みデータとデフォルト値をマージ
		foreach ( self::DB_NAMES as $key => $db_name ) {
			$db_data            = get_option( $db_name ) ?: [];
			self::$data[ $key ] = array_merge( self::$defaults[ $key ], $db_data );
		}
	}


	/**
	 * 設定データのデフォルト値を取得
	 *   キーが指定されていればそれを、指定がなければ全てを返す。
	 */
	public static function get_default_data( $name_key = '', $key = '' ) {

		// DBのID名の指定なければ全部返す
		if ( '' === $name_key ) return self::$defaults;

		// DBのID名が存在しない時
		if ( ! isset( self::$defaults[ $name_key ] ) ) return null;

		// ID指定のみでキーの指定がない時
		if ( '' === $key ) return self::$defaults[ $name_key ];

		// 指定されたIDのデータの中に指定されたキーが存在しない時
		if ( ! isset( self::$defaults[ $name_key ][ $key ] ) ) return '';

		// id, key がちゃんとある時
		return self::$defaults[ $name_key ][ $key ];
	}


	/**
	 * 設定データ取得
	 */
	public static function get_data( $name_key = '', $key = '' ) {

		// DBのID名の指定なければ全部返す
		if ( '' === $name_key ) return self::$data;

		// DBのID名が存在しない時
		if ( ! isset( self::$data[ $name_key ] ) ) return null;

		// ID指定のみでキーの指定がない時
		if ( '' === $key ) return self::$data[ $name_key ];

		// 指定されたIDのデータの中に指定されたキーが存在しない時
		if ( ! isset( self::$data[ $name_key ][ $key ] ) ) return '';

		// id, key がちゃんとある時
		return self::$data[ $name_key ][ $key ];
	}


	/**
	 * 設定データを強制セット
	 */
	// public static function set_data( $name_key = '', $key = '', $val = '' ) {
	// 	if ( '' === $name_key || '' === $key ) return;
	// 	self::$data[ $name_key ][ $key ] = $val;
	// }

	/**
	 * 設定データをリセット
	 */
	// public static function reset_data( $id = '' ) {
	// 	if ( $id ) {
	// 		// 指定されたものだけ削除
	// 		delete_option( \Arkhe_Blocks::DB_NAMES[ $id ] );
	// 	} else {
	// 		// カスタマイザー以外全削除
	// 		foreach ( \Arkhe_Blocks::DB_NAMES as $key => $db_name ) {
	// 			delete_option( $db_name );
	// 		}
	// 	}
	// }
}
