<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

class Data {

	// private static $instance;

	// 設定データを保持する変数
	protected static $data     = [];
	protected static $defaults = [];

	// DB名
	const DB_NAMES = [
		// 'customizer' => 'arkhe_blocks_customizer',
		'colors'  => 'arkhe_blocks_colors',
	];

	// メニューのページスラッグ
	const MENU_SLUG = 'arkhe_blocks_settings';

	// メニューの設定タブ
	public static $menu_tabs = [];

	// 外部からインスタンス化させない
	private function __construct() {}


	// init()
	public static function init() {

		// 設定データセット
		add_action( 'after_setup_theme', [ '\Arkhe_blocks', 'data_init' ], 9 );
		// add_action( 'wp_loaded', [ '\Arkhe_blocks', 'customizer_data_init' ] );
	}


	/**
	 * 設定データの初期セット
	 */
	public static function data_init() {

		// デフォルト値
		self::set_defaults();

		foreach ( self::DB_NAMES as $key => $db_name ) {
			// if ( 'customizer' === $key ) continue;
			$db_data            = get_option( $db_name ) ?: [];
			self::$data[ $key ] = array_merge( self::$defaults[ $key ], $db_data );
		}
	}


	/**
	 * カスタマイザーデータの初期セット
	 */
	// public static function customizer_data_init() {
	// 	$db_data                  = get_option( self::DB_NAMES['customizer'] ) ?: [];
	// 	self::$data['customizer'] = array_merge( self::$defaults['customizer'], $db_data );
	// }


	/**
	 * デフォルト値をセット
	 */
	private static function set_defaults() {

		// self::$defaults['customizer'] = [
		// 	'hoge'         => '',
		// ];

		self::$defaults['colors'] = [
			'hogehoge'   => '1',
		];

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
	public static function set_data( $name_key = '', $key = '', $val = '' ) {
		if ( '' === $name_key || '' === $key ) return;

		// データのセット
		self::$data[ $name_key ][ $key ] = $val;

	}

	/**
	 * 設定データをリセット
	 */
	public static function reset_data( $id = '' ) {
		if ( $id ) {
			// 指定されたものだけ削除
			delete_option( \Arkhe_blocks::DB_NAMES[ $id ] );
		} else {
			// カスタマイザー以外全削除
			foreach ( \Arkhe_blocks::DB_NAMES as $key => $db_name ) {
				if ( 'customizer' === $key ) continue;
				delete_option( $db_name );
			}
		}
	}
}
