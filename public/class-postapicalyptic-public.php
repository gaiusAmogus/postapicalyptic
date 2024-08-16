<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://voidnetrun.it
 * @since      1.0.0
 *
 * @package    postapicalyptic
 * @subpackage postapicalyptic/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the postapicalyptic, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    postapicalyptic
 * @subpackage postapicalyptic/public
 * @author     Dawid Jedynak <kontakt@voidnetrun.it>
 */
class postapicalyptic_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $postapicalyptic    The ID of this plugin.
	 */
	private $postapicalyptic;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $postapicalyptic       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $postapicalyptic, $version ) {

		$this->postapicalyptic = $postapicalyptic;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in postapicalyptic_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The postapicalyptic_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->postapicalyptic, plugin_dir_url( __FILE__ ) . 'assets/css/postapicalyptic-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in postapicalyptic_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The postapicalyptic_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->postapicalyptic, plugin_dir_url( __FILE__ ) . 'assets/js/postapicalyptic-public.js', array( 'jquery' ), $this->version, false );

	}

}
