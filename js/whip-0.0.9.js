var WHIP = (function() {
	// Private

	/**
	 * The WebGL Context.
	 * @private
	 * @type {WebGLRenderingContext}
	 * @since 0.0.1
	 */
	var gl;

	/**
	 * The Canvas element reference.
	 * @private
	 * @type {Element}
	 * @since 0.0.1
	 */
	var canvas;

	/**
	 * A bit value used for clearing the screen.
	 * @private
	 * @type {Number}
	 * @since 0.0.1
	 */
	var clearFlags = 0;
	
	/**
	 * Force the display to render with gl.LINE_LOOP.
	 * @private
	 * @type {Boolean}
	 * @since 0.0.4
	 */
	var forceWireframe = false;

	/**
	 * Fullscreen boolean value.
	 * @private
	 * @type {Boolean}
	 * @since 0.0.1
	 */
	var fullscreen = false;

	/**
	 * Calls all of the initialization functions.
	 * @private
	 * @since 0.0.1
	 */
	function init() {
		try {

			initGL();
			initGLStatics();
			initColors();

			WHIP.enableClearFlag(WHIP.COLOR_BUFFER_BIT);
			WHIP.resize();
		} catch (e) {
			throw e;
		}
		if (!gl) {
			alert("Could not initialise WebGL, sorry :-(");
		}
	};
	
	/**
	 * Sets up the WebGL context variable.
	 * @private
	 * @since 0.0.2
	*/
	function initGL() {
		// Obtain the canvas element
		canvas = document.getElementById("webgl-canvas");
		if (!canvas) {
			throw new Error("No suitable canvas. Make sure canvas <id> is \"webgl-canvas\".");
		}

		// Determine whether or not fullscreen is enabled
		fullscreen = (canvas.getAttribute("fullscreen") == "true") ? true : false;
		if (fullscreen) {
			document.body.style.padding = "0";
			document.body.style.margin = "0";
			document.body.style.position = "absolute";
			document.body.style.overflow = "hidden";
		}
		
		// Initialize the WebGL context
		gl = canvas.getContext("webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	}
	
	/**
	 * Provides a shortcut way to access GL static constants, by using WHIP.<constant>
	 * instead of having to call WHIP.getGL().<constant> every time you want to use one.
	 * Really only takes 8 characters out of the call, but it looks better.
	 * @private
	 * @since 0.0.2
	*/
	function initGLStatics() {
		// Copy over buffer bit values to shortcuts
		WHIP.COLOR_BUFFER_BIT = gl.COLOR_BUFFER_BIT;
		WHIP.DEPTH_BUFFER_BIT = gl.DEPTH_BUFFER_BIT;
		WHIP.STENCIL_BUFFER_BIT = gl.STENCIL_BUFFER_BIT;

		// Copy over drawing mode values to shortcuts
		WHIP.POINTS = gl.POINTS;
		WHIP.LINES = gl.LINES;
		WHIP.LINE_STRIP = gl.LINE_STRIP;
		WHIP.LINE_LOOP = gl.LINE_LOOP;
		WHIP.TRIANGLES = gl.TRIANGLES;
		WHIP.TRIANGLE_STRIP = gl.TRIANGLE_STRIP;
		WHIP.TRIANGLE_FAN = gl.TRIANGLE_FAN;
		
		// Copy over gl.enable() values to shortcuts
		WHIP.BLEND                    = gl.BLEND;
		WHIP.CULL_FACE                = gl.CULL_FACE;
		WHIP.DEPTH_TEST               = gl.DEPTH_TEST;
		WHIP.DITHER                   = gl.DITHER;
		WHIP.POLYGON_OFFSET_FILL      = gl.POLYGON_OFFSET_FILL;
		WHIP.SAMPLE_ALPHA_TO_COVERAGE = gl.SAMPLE_ALPHA_TO_COVERAGE;
		WHIP.SAMPLE_COVERAGE          = gl.SAMPLE_COVERAGE;
		WHIP.SCISSOR_TEST             = gl.SCISSOR_TEST;
		WHIP.STENCIL_TEST             = gl.STENCIL_TEST;
		
		// Copy over blend functions
		WHIP.BLENDING = {};
		WHIP.BLENDING.ZERO                     = gl.ZERO;
		WHIP.BLENDING.ONE                      = gl.ONE;
		WHIP.BLENDING.SRC_COLOR                = gl.SRC_COLOR;
		WHIP.BLENDING.ONE_MINUS_SRC_COLOR      = gl.ONE_MINUS_SRC_COLOR;
		WHIP.BLENDING.DST_COLOR                = gl.DST_COLOR;
		WHIP.BLENDING.ONE_MINUS_DST_COLOR      = gl.ONE_MINUS_DST_COLOR;
		WHIP.BLENDING.SRC_ALPHA                = gl.SRC_ALPHA;
		WHIP.BLENDING.ONE_MINUS_SRC_ALPHA      = gl.ONE_MINUS_SRC_ALPHA;
		WHIP.BLENDING.DST_ALPHA                = gl.DST_ALPHA;
		WHIP.BLENDING.ONE_MINUS_DST_ALPHA      = gl.ONE_MINUS_DST_ALPHA;
		WHIP.BLENDING.CONSTANT_COLOR           = gl.CONSTANT_COLOR;
		WHIP.BLENDING.ONE_MINUS_CONSTANT_COLOR = gl.ONE_MINUS_CONSTANT_COLOR;
		WHIP.BLENDING.CONSTANT_ALPHA           = gl.CONSTANT_ALPHA;
		WHIP.BLENDING.ONE_MINUS_CONSTANT_ALPHA = gl.ONE_MINUS_CONSTANT_ALPHA;
		WHIP.BLENDING.SRC_ALPHA_SATURATE       = gl.SRC_ALPHA_SATURATE;
		
		// Copy over culling modes
		WHIP.CULLING = {};
		WHIP.CULLING.FRONT = gl.FRONT;
		WHIP.CULLING.BACK = gl.BACK;
		WHIP.CULLING.FRONT_AND_BACK = gl.FRONT_AND_BACK;
		
		// Copy over depth functions
		WHIP.FUNC = {};
		WHIP.FUNC.NEVER = gl.NEVER;
		WHIP.FUNC.LESS = gl.LESS;
		WHIP.FUNC.EQUAL = gl.EQUAL;
		WHIP.FUNC.LEQUAL = gl.LEQUAL;
		WHIP.FUNC.GREATER = gl.GREATER;
		WHIP.FUNC.NOTEQUAL = gl.NOTEQUAL;
		WHIP.FUNC.GEQUAL = gl.GEQUAL;
		WHIP.FUNC.ALWAYS = gl.ALWAYS;
	}
	
	/**
	 * Just some basic color definitions.
	 * @private
	 * @since 0.0.2
	*/
	function initColors() {
		WHIP.COLORS = {};
		WHIP.COLORS.BLACK      = [   0 / 255,   0 / 255,   0 / 255, 255 / 255 ];
		WHIP.COLORS.BLUE       = [   0 / 255,   0 / 255, 255 / 255, 255 / 255 ];
		WHIP.COLORS.BROWN      = [ 165 / 255,  42 / 255,  42 / 255, 255 / 255 ];
		WHIP.COLORS.CRIMSON    = [ 220 / 255,  20 / 255,  60 / 255, 255 / 255 ];
		WHIP.COLORS.CYAN       = [   0 / 255, 255 / 255, 255 / 255, 255 / 255 ];
		WHIP.COLORS.DARK_BLUE  = [   0 / 255,   0 / 255, 139 / 255, 255 / 255 ];
		WHIP.COLORS.DARK_GREEN = [   0 / 255, 100 / 255,   0 / 255, 255 / 255 ];
		WHIP.COLORS.DARK_RED   = [ 139 / 255,   0 / 255,   0 / 255, 255 / 255 ];
		WHIP.COLORS.GOLD       = [ 255 / 255, 215 / 255,   0 / 255, 255 / 255 ];
		WHIP.COLORS.GREEN      = [   0 / 255, 128 / 255,   0 / 255, 255 / 255 ];
		WHIP.COLORS.GRAY       = [ 128 / 255, 128 / 255, 128 / 255, 255 / 255 ];
		WHIP.COLORS.GREY       = [ 128 / 255, 128 / 255, 128 / 255, 255 / 255 ];
		WHIP.COLORS.INDIGO     = [  75 / 255,   0 / 255, 130 / 255, 255 / 255 ];
		WHIP.COLORS.LIME       = [   0 / 255, 255 / 255,   0 / 255, 255 / 255 ];
		WHIP.COLORS.MAGENTA    = [ 255 / 255,   0 / 255, 255 / 255, 255 / 255 ];
		WHIP.COLORS.MAROON     = [ 139 / 255,   0 / 255,   0 / 255, 255 / 255 ];
		WHIP.COLORS.ORANGE     = [ 255 / 255, 165 / 255,   0 / 255, 255 / 255 ];
		WHIP.COLORS.ORANGE_RED = [ 255 / 255,  69 / 255,   0 / 255, 255 / 255 ];
		WHIP.COLORS.PINK       = [ 255 / 255, 105 / 255, 180 / 255, 255 / 255 ];
		WHIP.COLORS.PURPLE     = [ 127 / 255,   0 / 255, 127 / 255, 255 / 255 ];
		WHIP.COLORS.RED        = [ 255 / 255,   0 / 255,   0 / 255, 255 / 255 ];
		WHIP.COLORS.SLATE      = [  47 / 255,  79 / 255,  79 / 255, 255 / 255 ];
		WHIP.COLORS.TAN        = [ 210 / 255, 180 / 255, 140 / 255, 255 / 255 ];
		WHIP.COLORS.TRANSPARENT = [  0 / 255,   0 / 255,   0 / 255,   0 / 255 ];
		WHIP.COLORS.VIOLET     = [ 238 / 255, 130 / 255, 238 / 255, 255 / 255 ];
		WHIP.COLORS.WHITE      = [ 255 / 255, 255 / 255, 255 / 255, 255 / 255 ];
		WHIP.COLORS.YELLOW     = [ 255 / 255, 255 / 255,   0 / 255, 255 / 255 ];
	}
	
	class Mesh {
			
		constructor(vertices, textureCoords, normals, indices) {
			
			this.hasTextureCoords = false;
			this.hasNormals = false;
			this.hasIndices = false;
			
			if (!(vertices instanceof WHIP.Buffer)) {
				throw new Error("Tried to create a mesh with no vertex buffer.");
			}
			
			if (textureCoords !== undefined) {
				if (textureCoords instanceof WHIP.Buffer) {
					this.hasTextureCoords = true;
					this.textureCoords = textureCoords;
				} else if (textureCoords === null) {
					// do nothing
				} else {
					throw new Error("Created Mesh has incorrect texture coordinates parameter.");
				}
			}
			
			if (normals !== undefined) {
				if (normals instanceof WHIP.Buffer) {
					this.hasNormals = true;
					this.normals = normals;
				} else if (normals === null) {
					// do nothing
				} else {
					throw new Error("Created Mesh has incorrect normals parameter.");
				}
			}
			
			if (indices !== undefined) {
				if (indices instanceof WHIP.Buffer) {
					this.hasIndices = true;
					this.indices = indices;
				} else if (indices === null) {
					// do nothing
				} else {
					throw new Error("Created Mesh has incorrect indices parameter.");
				}
			}
			
			/**
			 * Vertex Buffer
			 * @type {WHIP.Buffer)
			*/
			this.vertices = vertices;
		}
		
		setTextureCoords(coords) {
			this.hasTextureCoords = true;
			this.textureCoords = coords;
		}

		setNormals(normals) {
			this.hasNormals = true;
			this.normals = normals;
		}
		
		setIndices(indices) {
			this.hasIndices = true;
			this.indices = indices;
		}
		
	}

	// Public
	return {

		/**
		 * Expose access to the WebGLRenderingContext object if need be.
		 * @return {WebGLRenderingContext} gl The rendering context.
		 * @since 0.0.1
		 */
		getGL: function() {
			return gl;
		},

		/**
		 * Expose access to the Canvas element if need be.
		 * @return {Element} canvas The canvas element.
		 * @since 0.0.1
		 */
		getCanvas: function() {
			return canvas;
		},

		/**
		 * Entry point for the page. Initializes, then calls the post-init user-defined function.
		 * @throw {FunctionNotFoundException} WHIPPostInit hasn't be defined.
		 * @since 0.0.1
		 */
		start: function() {
			init();
			if (typeof WHIPPostInit !== "function") {
				throw new Error("Need to implement a global function \"WHIPPostInit()\"");
			}
			WHIPPostInit();
		},

		/**
		 * Clears the screen and resets the viewport.
		 * @since 0.0.1
		 */
		clear: function() {
			gl.clear(clearFlags);
		},

		/**
		 * Resize the WebGL canvas to fullscreen.
		 * @since 0.0.1
		 */
		resize: function() {
			if (!fullscreen) return;

			canvas.width = document.body.clientWidth;
			canvas.height = document.body.clientHeight;

			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;

			WHIP.clear();
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		},

		/**
		 * Calculate the ratio between the viewport width and height.
		 * @return {Number} the ratio between width and height.
		 * @since 0.0.1
		 */
		getPerspectiveRatio: function() {
			return gl.viewportWidth / gl.viewportHeight;
		},

		/**
		 * Set fullscreen status.
		 * @param {Boolean} val
		 * #throw {IllegalArgumentException} needs to be boolean true or false
		 * @since 0.0.1
		 */
		setFullscreen: function(val) {
			if (val === true) {
				fullscreen = true;
			} else if (val === false) {
				fullscreen = false;
			} else {
				throw new Error("You tried to set fullscreen to \"" + val + "\".");
			}
		},

		/**
		 * Get the fullscreen status.
		 * @return {Boolean} fullscreen Whether or not fullscreen is enabled or disabled.
		 * @since 0.0.1
		 */
		getFullscreen: function() {
			return fullscreen;
		},

		/**
		 * Little wrapper for gl.clearColor so you don't have to call WHIP.getGL().clearColor() every time.
		 * This function can take either an array of 4 colors (RGBA), 4 individual parameters (r, g, b, a),
		 * or a string of the color's name.
		 * @param {Number} r The red component of the clear color OR an array of 4 values OR a string.
		 * @param {Number} g The green component of the clear color.
		 * @param {Number} b The blue component of the clear color.
		 * @param {Number} a The alpha component of the clear color.
		 * @throw {IllegalArgumentException} The specified color string isn't an available color.
		 * @throw {IllegalArgumentException} Wrong number of colors supplied to the call as an array.
		 * @throw {IllegalArgumentException} Wrong number of colors supplied to the call as individual values.
		 * @since 0.0.1
		 */
		setClearColor: function(r /* ... */ ) {
			if (typeof r === "string") {
				switch (r.toLowerCase()) {
					case "transparent":
						WHIP.setClearColor(WHIP.COLORS.TRANSPARENT);
						break;
					case "black":
						WHIP.setClearColor(WHIP.COLORS.BLACK);
						break;
					case "blue":
						WHIP.setClearColor(WHIP.COLORS.BLUE);
						break;
					case "brown":
						WHIP.setClearColor(WHIP.COLORS.BROWN);
						break;
					case "cyan":
						WHIP.setClearColor(WHIP.COLORS.CYAN);
						break;
					case "dark blue":
						WHIP.setClearColor(WHIP.COLORS.DARK_BLUE);
						break;
					case "dark green":
						WHIP.setClearColor(WHIP.COLORS.DARK_GREEN);
						break;
					case "dark red":
						WHIP.setClearColor(WHIP.COLORS.DARK_RED);
						break;
					case "gold":
						WHIP.setClearColor(WHIP.COLORS.GOLD);
						break;
					case "green":
						WHIP.setClearColor(WHIP.COLORS.GREEN);
						break;
					case "gray":
						WHIP.setClearColor(WHIP.COLORS.GREY);
						break;
					case "grey":
						WHIP.setClearColor(WHIP.COLORS.GREY);
						break;
					case "indigo":
						WHIP.setClearColor(WHIP.COLORS.INDIGO);
						break;
					case "lime":
						WHIP.setClearColor(WHIP.COLORS.LIME);
						break;
					case "magenta":
						WHIP.setClearColor(WHIP.COLORS.MAGENTA);
						break;
					case "maroon":
						WHIP.setClearColor(WHIP.COLORS.MAROON);
						break;
					case "orange":
						WHIP.setClearColor(WHIP.COLORS.ORANGE);
						break;
					case "orange red":
						WHIP.setClearColor(WHIP.COLORS.ORANGE_RED);
						break;
					case "pink":
						WHIP.setClearColor(WHIP.COLORS.PINK);
						break;
					case "purple":
						WHIP.setClearColor(WHIP.COLORS.PURPLE);
						break;
					case "red":
						WHIP.setClearColor(WHIP.COLORS.RED);
						break;
					case "slate":
						WHIP.setClearColor(WHIP.COLORS.SLATE);
						break;
					case "tan":
						WHIP.setClearColor(WHIP.COLORS.TAN);
						break;
					case "violet":
						WHIP.setClearColor(WHIP.COLORS.VIOLET);
						break;
					case "white":
						WHIP.setClearColor(WHIP.COLORS.WHITE);
						break;
					case "yellow":
						WHIP.setClearColor(WHIP.COLORS.YELLOW);
						break;
					default:
						throw new Error("Color \"" + r + "\" doesn't exist.");
						break;
				}
				return;
			}
			if (r.constructor === Array) {
				if (r.length != 4) {
					throw new Error("Wrong number of arguments in array that was passed to WHIP.setClearColor().");
				}
				gl.clearColor(r[0], r[1], r[2], r[3]);
				return;
			}
			if (arguments.length != 4) {
				throw new Error("Wrong number of arguments passed to WHIP.setClearColor().");
			}
			gl.clearColor(r, arguments[1], arguments[2], arguments[3]);
			return;
		},

		/**
		 * Bitwise OR the flag bit value to set it.
		 * @param {Number} flag The BUFFER_BIT value.
		 * @since 0.0.1
		 */
		enableClearFlag: function(flag) {
			if (!(flag && (flag & (flag - 1)) === 0)) {
				throw new Error("Tried to enable a clear flag that isn't a power of 2!");
				return;
			}
			clearFlags |= flag;
		},

		/**
		 * Bitwise AND the negation of the flag bit value to clear it.
		 * @param {Number} flag The BUFFER_BIT value.
		 * @since 0.0.1
		 */
		disableClearFlag: function(flag) {
			if (!(flag && (flag & (flag - 1)) === 0)) {
				throw new Error("Tried to disable a clear flag that isn't a power of 2!");
				return;
			}
			clearFlags &= ~flag;
		},
		
		/**
		 * Enable a specific WebGL capability.
		 * @param {Number} cap The capability to enable.
		 * @since 0.06
		*/
		enableCapability: function(cap) {
			gl.enable(cap);
		},
		
		/**
		 * Disable a specific WebGL capability.
		 * @param {Number} cap The capability to enable.
		 * @since 0.06
		*/
		disableCapability: function(cap) {
			gl.disable(cap);
		},
		
		/**
		 * Enable blending capability.
		 * @since 0.0.6
		*/
		enableBlending: function() {
			gl.enable(gl.BLEND);
		},
		
		/**
		 * Disable blending capability.
		 * @since 0.0.6
		*/
		disableBlending: function() {
			gl.disable(gl.BLEND);
		},
		
		/**
		 * Sets the blending function.
		 * "... defines which function is used for blending pixel arithmetic."
		 * @param {Number} srcFunc The WHIP.BLENDING value for the type of blending.
		 * @param {Number} dstFunc The WHIP.BLENDING value for the type of blending.
		 * @throw {NoSuchElementException} the function that was tried doesn't exist.
		 * @since 0.0.6
		*/
		setBlendingFunction: function(srcFunc, dstFunc) {
			if (Object.values(WHIP.BLENDING).indexOf(srcFunc) == -1) {
				console.log(WHIP.BLENDING);
				throw new Error("Blending function \"" + srcFunc + "\" is not a valid function. WHIP.BLENDING keys are valid.");
			}
			if (Object.values(WHIP.BLENDING).indexOf(dstFunc) == -1) {
				console.log(WHIP.BLENDING);
				throw new Error("Blending function \"" + dstFunc + "\" is not a valid function. WHIP.BLENDING keys are valid.");
			}
			gl.blendFunc(srcFunc, dstFunc);
		},
		
		/**
		 * Enable culling capability.
		 * @since 0.0.6
		*/
		enableCulling: function() {
			gl.enable(gl.CULL_FACE);
		},
		
		/**
		 * Disable culling capability.
		 * @since 0.0.6
		*/
		disableCulling: function() {
			gl.disable(gl.CULL_FACE);
		},
		
		/**
		 * Sets the face culling function.
		 * "... specifies whether or not front- and/or back-facing polygons can be culled."
		 * @param {Number} func The WHIP.FUNC value for the type of test.
		 * @throw {NoSuchElementException} the function that was tried doesn't exist.
		 * @since 0.0.6
		*/
		setCullingFunction: function(func) {
			if (Object.values(WHIP.CULLING).indexOf(func) == -1) {
				console.log(WHIP.CULLING);
				throw new Error("Culling function \"" + func + "\" is not a valid function. WHIP.CULLING keys are valid.");
			}
			gl.cullFace(func);
		},
		
		/**
		 * Enable depth test capability.
		 * @since 0.0.6
		*/
		enableDepthTest: function() {
			gl.enable(gl.DEPTH_TEST);
		},
		
		/**
		 * Disable depth test capability.
		 * @since 0.0.6
		*/
		disableDepthTest: function() {
			gl.disable(gl.DEPTH_TEST);
		},
		
		/**
		 * Sets the depth function.
		 * "... specifies a function that compares incoming pixel depth to the current depth buffer value."
		 * @param {Number} func The WHIP.FUNC value for the type of test.
		 * @throw {NoSuchElementException} the function that was tried doesn't exist.
		 * @since 0.0.6
		*/
		setDepthFunction: function(func) {
			if (Object.values(WHIP.FUNC).indexOf(func) == -1) {
				console.log(WHIP.FUNC);
				throw new Error("Depth function \"" + func + "\" is not a valid function. WHIP.FUNC keys are valid.");
			}
			gl.depthFunc(func);
		},
		
		/**
		 * Enable dither capability.
		 * @since 0.0.6
		*/
		enableDither: function() {
			gl.enable(gl.DITHER);
		},
		
		/**
		 * Disable dither capability.
		 * @since 0.0.6
		*/
		disableDither: function() {
			gl.disable(gl.DITHER);
		},
		
		/**
		 * Enable polygon offset capability.
		 * @since 0.0.6
		*/
		enablePolygonOffset: function() {
			gl.enable(gl.POLYGON_OFFSET_FILL);
		},
		
		/**
		 * Disable polygon offset capability.
		 * @since 0.0.6
		*/
		disablePolygonOffset: function() {
			gl.disable(gl.POLYGON_OFFSET_FILL);
		},
		
		/**
		 * Sets the polygon offset depth value.
		 * @param {Number} factor The scale factor for the units.
		 * @param {Number} units Sets the multiplier that combines with the constant depth offset.
		 * @throw {IllegalArgumentException} the arguments are not numbers.
		 * @since 0.0.6
		*/
		setPolygonOffset: function(factor, units) {
			if (!(typeof factor === "number") || !(typeof units === "number")) {
				throw new Error("Tried to set polygon offset function to a value that wasn't a float!");
			}
			gl.polygonOffset(factor, units);
		},
		
		/**
		 * Enable sample alpha to coverage capability.
		 * @since 0.0.6
		*/
		enableSATC: function() {
			gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
		},
		
		/**
		 * Disable sample alpha to coverage capability.
		 * @since 0.0.6
		*/
		disableSATC: function() {
			gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
		},
		
		/**
		 * Enable sample coverage capability.
		 * @since 0.0.6
		*/
		enableSampleCoverage: function() {
			gl.enable(gl.SAMPLE_COVERAGE);
		},
		
		/**
		 * Disable sample coverage capability.
		 * @since 0.0.6
		*/
		disableSampleCoverage: function() {
			gl.disable(gl.SAMPLE_COVERAGE);
		},
		
		/**
		 * Sets the sample coverage value and whether or not to invert that value.
		 * "... specifies multi-sample coverage parameters for anti-aliasing effects."
		 * @param {Number} value Clamped value for the coverage.
		 * @param {Boolean} invert Sets whether or not the coverage is inverted.
		 * @since 0.0.6
		*/
		setSampleCoverage: function(value, invert) {
			if (invert === undefined) {
				console.log("setSampleCoverage call invert value left undefined. Setting to false...");
				invert = false;
			}
			gl.sampleCoverage(value, invert);
		},
		
		/**
		 * Enable scissor test capability.
		 * @since 0.0.6
		*/
		enableScissorTest: function() {
			gl.enable(gl.SCISSOR_TEST);
		},
		
		/**
		 * Disable scissor test capability.
		 * @since 0.0.6
		*/
		disableScissorTest: function() {
			gl.disable(gl.SCISSOR_TEST);
		},
		
		/**
		 * Sets the scissor function.
		 * "... sets a scissor box, which limits the drawing to a specified rectangle."
		 * @param {Number} x The starting x-coordinate of the scissor box.
		 * @param {Number} y The starting y-coordinate of the scissor box.
		 * @param {Number} width The width of the scissor box.
		 * @param {Number} height The height of the scissor box.
		 * @throw {UndefinedArgumentException} there was an undefined argument.
		 * @since 0.0.6
		*/
		setScissorBox: function(x, y, width, height) {
			if (x === undefined || y === undefined || width === undefined || height === undefined) {
				throw new Error("Need to specify (x, y, width, height) for setScissorBox()!");
			}
			gl.scissor(x, y, width, height);
		},
		
		/**
		 * Enable stencil test capability.
		 * @since 0.0.6
		*/
		enableStencilTest: function() {
			gl.enable(gl.STENCIL_TEST);
		},
		
		/**
		 * Disable stencil test capability.
		 * @since 0.0.6
		*/
		disableStencilTest: function() {
			gl.disable(gl.STENCIL_TEST);
		},
		
		/**
		 * Sets the stencil function.
		 * "Stencilling enables and disables drawing on a per-pixel basis. It is 
		 * typically used in multipass rendering to achieve special effects."
		 * @param {Number} func The WHIP.FUNC value for the type of test.
		 * @param {Number} ref Reference value for the stencil test.
		 * @param {Number} mask An "8-bit" mask of 1's and 0's.
		 * @throw {NoSuchElementException} the function that was tried doesn't exist.
		 * @since 0.0.6
		*/
		setStencilFunction: function(func, ref, mask) {
			if (Object.values(WHIP.FUNC).indexOf(func) == -1) {
				console.log(WHIP.FUNC);
				throw new Error("Depth function \"" + func + "\" is not a valid function. WHIP.FUNC keys are valid.");
			}
			gl.stencilFunc(func, ref, mask);
		},
		
		/**
		 * Set wireframe status.
		 * @param {Boolean} val
		 * #throw {IllegalArgumentException} needs to be boolean true or false
		 * @since 0.0.4
		 */
		setWireframe: function(val) {
			if (val === true) {
				forceWireframe = true;
			} else if (val === false) {
				forceWireframe = false;
			} else {
				throw new Error("You tried to set wireframe to \"" + val + "\".");
			}
		},
		
		/**
		 * Toggle wireframe status.
		 * @since 0.0.4
		*/
		toggleWireframe: function() {
			forceWireframe = ~forceWireframe;
		},
		
		/**
		 * Get the wireframe status.
		 * @return {Boolean} forceWireframe Whether or not wireframe is forced or not.
		 * @since 0.0.4
		 */
		isWireframe: function() {
			return forceWireframe;
		},

		/**
		 * Wrapper for gl.drawElements(...)
		 * @param {Number} style The drawing mode.
		 * @param {Number} itemCount The number of items to draw.
		 * @since 0.0.1
		 */
		drawElements: function(style, itemCount) {
			if (forceWireframe) {
				style = WHIP.LINE_LOOP;
			}
			gl.drawElements(style, itemCount, gl.UNSIGNED_SHORT, 0);
		},

		/**
		 * Wrapper for gl.drawArrays(...)
		 * @param {Number} style The drawing mode.
		 * @param {Number} itemCount The number of items to draw.
		 * @since 0.0.1
		 */
		drawArrays: function(style, itemCount) {
			if (forceWireframe) {
				style = WHIP.LINE_LOOP;
			}
			gl.drawArrays(style, 0, itemCount);
		},
		
		/**
		 * Convert a degree value to a radian value.
		 * @param {Number} degrees The angle value in degrees.
		 * @return {Number} the angle in radians.
		 * @since 0.0.8
		*/
		degreesToRadians: function(degrees) {
			return degrees * Math.PI / 180;
		},
		
		/**
		 * Convert a radian value to a degree value.
		 * @param {Number} radians The angle value in radians.
		 * @return {Number} the angle in degrees.
		 * @since 0.0.8
		*/
		radiansToDegrees: function(radians) {
			return radians * 180 / Math.PI;
		},

		/**
		 * A wrapper for a general case WebGL Shader Program.
		 * @since 0.0.1
		 */
		ShaderProgram: class {

			/**
			 * A variable length constructor. Type must always be specified, and the shader program is built
			 * differently depending on which type is used.
			 * @param {String} type The load type.
			 * @throws {InvalidArgumentException} If type is not one of the available loading options.
			 * @since 0.0.1
			 */
			constructor(type /* ... */ ) {

				/**
				 * A reference to the WebGL created shader number.
				 * @type {Number}
				 */
				this.glProgram = null;
				
				this.vertexPositionsAttributeName = null;
				this.textureCoordsAttributeName = null;
				this.normalsAttributeName = null;
				this.indicesAttributeName = null;

				var fragment;
				var vertex;
				if (type == "script-element") {
					if (arguments.length != 3) {
						throw new Error("No script element IDs provided to WebGLShader");
					}
					fragment = this.compileShaderFromScriptElement(arguments[1]);
					vertex = this.compileShaderFromScriptElement(arguments[2]);
				} else if (type == "string") {
					if (arguments.length != 3) {
						throw new Error("Shader strings not given to WebGLShaderProgram");
					}
					fragment = this.compileShaderFromString("fs", arguments[1]);
					vertex = this.compileShaderFromString("vs", arguments[2]);
				} else {
					throw new Error("WebGLShaderProgram type \"" + type + "\" is not supported!");
				}

				this.glProgram = gl.createProgram();
				gl.attachShader(this.glProgram, fragment);
				gl.attachShader(this.glProgram, vertex);
				gl.linkProgram(this.glProgram);

				if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
					throw new Error("Could not initialise shaders");
				}
			}

			/**
			 * Tells WebGL to use this shader program.
			 * @since 0.0.1
			 */
			use() {
				gl.useProgram(this.glProgram);
			}

			/**
			 * Set a key of the object equal to the WebGL attribute location call.
			 * @param {String} attrib The attribute name.
			 * @since 0.0.1
			 */
			addAttribute(attrib) {
				this[attrib] = gl.getAttribLocation(this.glProgram, attrib);
			}

			/**
			 * Return the attribute location if it exists and has been added prior to this call.
			 * @param {String} attrib The attribute name.
			 * @throw {NoSuchElementException} The given attribute name doesn't exist.
			 * @return {Number} this[attrib] The value of the attribute key, if it exists.
			 * @since 0.0.1
			 */
			getAttribute(attrib) {
				if (this[attrib] == null || this[attrib] == undefined) {
					throw new Error("Attribute \"" + attrib + "\" is null or undefined!");
					return null;
				}
				return this[attrib];
			}

			/**
			 * Enables the attribute array. DOES NOT ERROR CHECK.
			 * @param {String} attrib The attribute name.
			 * @since 0.0.1
			 */
			enableAttribute(attrib) {
				gl.enableVertexAttribArray(this.getAttribute(attrib));
			}

			/**
			 * Disables an attribute array given an attribute name. Used to tell WebGL about shaders with less attributes.
			 * @param {String} attrib The attribute name.
			 * @see {@link https://stackoverflow.com/questions/9705771/conflict-when-using-two-or-more-shaders-with-different-number-of-attributes?rq=1}
			 * @since 0.0.1
			 */
			disableAttribute(attrib) {
				gl.disableVertexAttribArray(this.getAttribute(attrib));
			}

			/**
			 * Tells WebGL how many bytes represent each vertex, represented by a specific attribute array.
			 * @param {String} attrib The attribute name.
			 * @param {Number} itemSize The amount of bytes per "item" in the attribute. For instance, a vertex position will be 3, since (x, y, z).
			 * @since 0.0.1
			 */
			attributePointer(attrib, itemSize) {
				gl.vertexAttribPointer(this.getAttribute(attrib), itemSize, gl.FLOAT, false, 0, 0);
			}
			
			/**
			 * Adds the attribute but links it to the shader program's vertex position attribute variable.
			 * @param {String} attrib The attribute to add and link.
			 * @since 0.0.9
			*/
			addVertexPositionAttribute(attrib) {
				this.addAttribute(attrib);
				this.vertexPositionsAttributeName = attrib;
			}
			
			/**
			 * Adds the attribute but links it to the shader program's vertex position attribute variable.
			 * Then enables it.
			 * @param {String} attrib The attribute to add, link, and enable.
			 * @since 0.0.9
			*/
			addAndEnableVertexPositionAttribute(attrib) {
				this.addVertexPositionAttribute(attrib);
				this.enableAttribute(attrib);
			}
			
			/**
			 * Adds the attribute but links it to the shader program's texture coordinate attribute variable.
			 * @param {String} attrib The attribute to add and link.
			 * @since 0.0.9
			*/
			addTextureCoordsAttribute(attrib) {
				this.addAttribute(attrib);
				this.textureCoordsAttributeName = attrib;
			}
			
			/**
			 * Adds the attribute but links it to the shader program's texture coordinate attribute variable.
			 * Then enables it.
			 * @param {String} attrib The attribute to add, link, and enable.
			 * @since 0.0.9
			*/
			addAndEnableTextureCoordsAttribute(attrib) {
				this.addTextureCoordsAttribute(attrib);
				this.enableAttribute(attrib);
			}
			
			/**
			 * Adds the attribute but links it to the shader program's normal attribute variable.
			 * @param {String} attrib The attribute to add and link.
			 * @since 0.0.9
			*/
			addNormalsAttribute(attrib) {
				this.addAttribute(attrib);
				this.normalsAttributeName = attrib;
			}
			
			/**
			 * Adds the attribute but links it to the shader program's normal attribute variable.
			 * Then enables it.
			 * @param {String} attrib The attribute to add, link, and enable.
			 * @since 0.0.9
			*/
			addAndEnableNormalsAttribute(attrib) {
				this.addNormalsAttribute(attrib)
				this.enableAttribute(attrib);
			}
			
			/**
			 * Set a key of the object equal to the WebGL uniform location call.
			 * @param {String} uniform The uniform name.
			 * @since 0.0.1
			 */
			addUniform(uniform, type) {
				this[uniform] = {};
				this[uniform].location = gl.getUniformLocation(this.glProgram, uniform);
				this[uniform].type = type; // TODO: error check this type
			}

			/**
			 * Return the uniform location if it exists and has been added prior to this call.
			 * @param {String} uniform The uniform name.
			 * @throw {NoSuchElementException} The given uniform name doesn't exist.
			 * @return {Number} this[uniform] The value of the uniform key, if it exists.
			 * @since 0.0.1
			 */
			getUniform(uniform) {
				if (this[uniform] == null || this[uniform] == undefined) {
					throw new Error("Uniform \"" + uniform + "\" is null or undefined!");
					return null;
				}
				return this[uniform];
			}

			/**
			 * Sets a uniform variable based on its type and its name.
			 * @param {String} uniformType The uniform type (1i, 4f, Matrix3fv, etc).
			 * @param {String} uniformName The uniform name.
			 * @param {Number} value The uniform value.
			 * @since 0.0.1
			 */
			setUniform(uniformName, value) {
				var uniform = this.getUniform(uniformName);
				switch (uniform.type) {
					case "1i":
						gl.uniform1i(uniform.location, value);
						break;
					case "1f":
						gl.uniform1f(uniform.location, value);
						break;
					case "2f":
						gl.uniform2f(uniform.location, value);
						break;
					case "3f":
						gl.uniform3f(uniform.location, value);
						break;
					case "4f":
						gl.uniform4f(uniform.location, value);
						break;
					case "1iv":
						gl.uniform1iv(uniform.location, value);
						break;
					case "3iv":
						gl.uniform3iv(uniform.location, value);
						break;
					case "1fv":
						gl.uniform1fv(uniform.location, value);
						break;
					case "2fv":
						gl.uniform2fv(uniform.location, value);
						break;
					case "3fv":
						gl.uniform3fv(uniform.location, value);
						break;
					case "4fv":
						gl.uniform4fv(uniform.location, value);
						break;
					case "Matrix3fv":
						gl.uniformMatrix3fv(uniform.location, false, value);
						break;
					case "Matrix4fv":
						gl.uniformMatrix4fv(uniform.location, false, value);
						break;
					default:
						throw new Error("Uniform type \"" + uniformType + "\" is not a valid uniform type.");
						break;
				}
			}
			
			/**
			 * Binds all the mesh's buffers, linking them to the shader program attributes automatically.
			 * @param {WHIP.Mesh} mesh The mesh to bind.
			 * @since 0.0.9
			*/
			bindMesh(mesh) {
				if (!(mesh instanceof Mesh)) {
					throw new Error("bindMesh() parameter is not a mesh!");
				}
				
				mesh.vertices.bind();
				this.attributePointer(this.vertexPositionsAttributeName, mesh.vertices.itemSize);
				
				if (mesh.hasTextureCoords) {
					mesh.textureCoords.bind();
					this.attributePointer(this.textureCoordsAttributeName, mesh.textureCoords.itemSize);
				}
				
				if (mesh.hasNormals) {
					mesh.normals.bind();
					this.attributePointer(this.normalsAttributeName, mesh.normals.itemSize);
				}
				
				if (mesh.hasIndices) {
					mesh.indices.bind();
				}
			}

			/**
			 * Compiles a WebGLShader from a string.
			 * @param {String} type The shader type. "fs" for fragment shader, "vs" for vertex shader.
			 * @param {String} str The shader source as a string.
			 * @return {WebGLShader} shader The compiled shader.
			 * @since 0.0.1
			 */
			compileShaderFromString(type, str) {
				var shader;
				if (type == "fs") {
					shader = gl.createShader(gl.FRAGMENT_SHADER);
				} else if (type == "vs") {
					shader = gl.createShader(gl.VERTEX_SHADER);
				}

				gl.shaderSource(shader, str);
				gl.compileShader(shader);

				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					throw new Error(gl.getShaderInfoLog(shader));
					return null;
				}

				return shader;
			}

			/**
			 * Compiles a WebGLShader from a <script> element in HTML.
			 * @param {String} id The <script> element ID tag.
			 * @throw {ElementNotFoundException} The provided element ID doesn't exist.
			 * @throw {WrongAttributeException} The provided element has a wrong type attribute.
			 * @return {WebGLShader} shader The compiled shader.
			 * @since 0.0.1
			 */
			compileShaderFromScriptElement(id) {
				var shaderScript = document.getElementById(id);

				if (!shaderScript) {
					throw new Error("Script element " + id + " doesn't exist.");
					return null;
				}

				if (shaderScript.type != "fs" && shaderScript.type != "vs") {
					throw new Error("Wrong script \"type\" attribute. Must be \"fs\" or \"vs\" for fragment/vertex respectively.");
				}

				var str = "";
				var k = shaderScript.firstChild;
				while (k) {
					if (k.nodeType == 3) {
						str += k.textContent;
					}
					k = k.nextSibling;
				}

				return this.compileShaderFromString(shaderScript.type, str);
			}
		}, // end shaderprogram

		/**
		 * A wrapper for the WebGL Texture unit.
		 * @since 0.0.1
		 */
		Texture: class {

			/**
			 * Builds and loads a texture from a filepath.
			 * @param {String} filePath The image's relative filepath.
			 * @throws {NoArgumentException} Must specify a filepath.
			 * @throws {FileNotFoundException} The filepath specified does not reference an image.
			 * @since 0.0.1
			 */
			constructor(imagePath) {

				/**
				 * Reference to the bound slot the texture resides in.
				 * @type {Number}
				 */
				this.boundSlot = -1;

				/**
				 * In order for a texture to be unbound, it must first be bound. This value keeps track
				 * of the texture's bound state.
				 * @type {Boolean}
				 */
				this.isBound = false;

				/**
				 * Boolean value representing the texture's load state. When the texture is created, the image
				 * contents are loaded asynchronously. When those contents are read into the texture data, this
				 * boolean updates to true.
				 * @type {Boolean}
				 */
				this.isLoaded = false;

				/**
				 * Reference to itself, so that the image.onload function can access the image source data.
				 * @type {WHIP.Texture}
				 */
				var self = this;

				/**
				 * Reference to the WebGL created texture number.
				 * @type {Number}
				 */
				this.glTexture = gl.createTexture();

				/**
				 * Create the texture's image object. Used to load image data into the WebGL texture.
				 * @type {Image}
				 */
				this.image = new Image();

				if (!imagePath) {
					throw new Error("Texture filepath not given.");
				} else {
					this.image.src = imagePath;
				}
				this.image.onload = function() {
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
					self.bind(0);
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.image);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
					self.unbind();
					self.isLoaded = true;
					self.onload();
				}
				this.image.onerror = function() {
					throw new Error("Problems loading image from path \"" + imagePath + "\". Check to make sure it exists.");
				}
			}
			
			/**
			 * Extension of the image.onload function. But this one is overwritable by the user and
			 * -should- be set before the image is done loading... I think!
			 * @since 0.0.3
			*/
			onload() {
				
			}

			/**
			 * Binds this texture to a specific slot.
			 * @param {Number} slot The gl.TEXTURE number to bind the texture to.
			 * @throws {NumberFormatException} The slot must be a number.
			 * @throws {IllegalArgumentException} The slot must be between 0 (inclusive) and 31 (inclusive).
			 * @since 0.0.1
			 */
			bind(slot) {
				if (slot === undefined) {
					throw new Error("No slot specified for binding this texture.");
				}
				if (typeof slot !== "number") {
					throw new Error("Texture slot is not a number. Please use gl.TEXTURE0 through gl.TEXTURE31");
				}

				slot += gl.TEXTURE0;
				if (slot < gl.TEXTURE0 || slot > gl.TEXTURE31) {
					throw new Error("Can't use that texture slot. Please use gl.TEXTURE0 through gl.TEXTURE31");
				}

				this.boundSlot = slot;
				this.isBound = true;
				gl.activeTexture(slot);
				gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
			}

			/**
			 * Unbinds this texture.
			 * @throws {NotBoundException} The texture hasn't been bound, and is trying to unbind.
			 * @since 0.0.1
			 */
			unbind() {
				if (this.boundSlot == -1) {
					throw new Error("Texture not bound yet. Please bind before unbinding.");
				}
				this.isBound = false;
				gl.activeTexture(this.boundSlot);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}
		}, // end texture

		/**
		 * A wrapper for a WebGL array buffer or a WebGL element array buffer.
		 * @since 0.0.1
		 */
		Buffer: class {

			/**
			 * Builds and fills a WebGL buffer, with a type of ELEMENT_ARRAY_BUFFER or ARRAY_BUFFER.
			 * @param {Number[]} bufferData The contents to fill the buffer with.
			 * @param {Number} bufferType The type of the buffer. ELEMENT_ARRAY_BUFFER or ARRAY_BUFFER.
			 * @param {Number} arrayType The type of the array contents. gl.FLOAT or gl.INT.
			 * @param {Number} itemSize The "size" of each item in the array. A position vertex would be 3, a texture coordinate would be 2.
			 * @param {Number} itemCount The number of items in the array.
			 * @throw {IllegalArgumentException} bufferType needs to be gl.ELEMENT_ARRAY_BUFFER or gl.ARRAY_BUFFER.
			 * @throw {IllegalArgumentException} arrayType needs to be gl.FLOAT or gl.INT.
			 * @since 0.0.1
			 */
			constructor(bufferData, bufferType, arrayType, itemSize, itemCount) {

				/**
				 * Refers to how many values correspond to a given item.
				 * @type {Number}
				 */
				this.itemSize = itemSize;

				/**
				 * Refers to how many total items there are in the buffer.
				 * This number multiplied by itemSize should equal the total number of values in the array.
				 * @type {Number}
				 */
				this.itemCount = itemCount;

				/**
				 * Reference to the WebGL created buffer number.
				 * @type {Number}
				 */
				this.glBuffer = gl.createBuffer();

				if (bufferType == gl.ELEMENT_ARRAY_BUFFER || bufferType === "element") {
					this.bufferType = gl.ELEMENT_ARRAY_BUFFER;
				} else if (bufferType == gl.ARRAY_BUFFER || bufferType === "array") {
					this.bufferType = gl.ARRAY_BUFFER;
				} else {
					throw new Error("WebGLBuffer buffer type \"" + bufferType + "\" not supported. Use gl.ELEMENT_ARRAY_BUFFER or gl.ARRAY_BUFFER");
					return;
				}

				gl.bindBuffer(this.bufferType, this.glBuffer);

				if (arrayType == gl.FLOAT || arrayType === "float") {
					gl.bufferData(this.bufferType, new Float32Array(bufferData), gl.STATIC_DRAW);
				} else if (arrayType == gl.INT || arrayType === "int") {
					gl.bufferData(this.bufferType, new Uint16Array(bufferData), gl.STATIC_DRAW);
				} else {
					throw new Error("WebGLBuffer array type \"" + arrayType + "\" not supported. Use gl.FLOAT or gl.INT");
					return;
				}
			}

			/**
			 * Binds this buffer as the appropriate type.
			 * @since 0.0.1
			 */
			bind() {
				gl.bindBuffer(this.bufferType, this.glBuffer);
			}
			
			/**
			 * Generates 4 WHIP.Buffer objects, storing them in an object, and returns that object,
			 * that represent a circle. Generated following the method developed by the WebKit team.
			 *
			 * Argument Count and Description:
			 * 0 - Generates a sphere with 24 lat/long bands and a radius of 1.0
			 * 1 - Generates a sphere with 24 lat/long bands and a radius of arguments[0]
			 * 2 - Generates a sphere with arguments[1] lat/long bands a radius of arguments[0]
			 * 3 - Generates a sphere with arguments[1] lat bands, arguments[2] long bands, and a radius of
			 *     arguments[0]
			 *
			 * @param {Number} radius The size of the sphere.
			 * @param {Number} latitudeBands The "resolution" of the north/south curves.
			 * @param {Number} longitudeBands The "resolution" of the east/west curves.
			 * @return {Object} circle The generated buffers for the sphere.
			 * @since 0.0.5
			*/
			static generateSphereBuffers(radius, latitudeBands, longitudeBands) {
				if (latitudeBands !== undefined && longitudeBands === undefined) {
					longitudeBands = latitudeBands;
				}
				if (latitudeBands === undefined && longitudeBands === undefined) {
					latitudeBands = longitudeBands = 16;
				}
				if (radius === undefined) {
					radius = 1.0;
				}
				
				var circle = {};
				
				var vertices = [];
				var normals = [];
				var textureCoords = [];
				var indices = [];
				
				for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
					var theta = latNumber * Math.PI / latitudeBands;
					var sinTheta = Math.sin(theta);
					var cosTheta = Math.cos(theta);
					
					for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
						var phi = longNumber * 2 * Math.PI / longitudeBands;
						var sinPhi = Math.sin(phi);
						var cosPhi = Math.cos(phi);
						
						var x = cosPhi * sinTheta;
						var y = cosTheta;
						var z = sinPhi * sinTheta;
						var u = 1 - (longNumber / longitudeBands);
						var v = 1 - (latNumber / latitudeBands);
						
						normals.push(x);
						normals.push(y);
						normals.push(z);
						textureCoords.push(u);
						textureCoords.push(v);
						vertices.push(radius * x);
						vertices.push(radius * y);
						vertices.push(radius * z);
					}
				}
				
				for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
					for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
						var first = (latNumber * (longitudeBands + 1)) + longNumber;
						var second = first + longitudeBands + 1;
						
						indices.push(first);
						indices.push(second);
						indices.push(first + 1);
						
						indices.push(second);
						indices.push(second + 1);
						indices.push(first + 1);
					}
				}
				
				circle.vertices = new WHIP.Buffer(vertices, gl.ARRAY_BUFFER, gl.FLOAT, 3, vertices.length / 3);
				circle.textureCoords = new WHIP.Buffer(textureCoords, gl.ARRAY_BUFFER, gl.FLOAT, 2, textureCoords.length / 2);
				circle.normals = new WHIP.Buffer(normals, gl.ARRAY_BUFFER, gl.FLOAT, 3, normals.length / 3);
				circle.indices = new WHIP.Buffer(indices, gl.ELEMENT_ARRAY_BUFFER, gl.INT, 1, indices.length);
				
				return circle;
			}
			
			/**
			 * Combines the below functions into a single call, returning an object with
			 * properties relating to the content of each of the buffers.
			 * Follows the same multi-argument pattern as squareVerticesBufferInstance().
			 * @param {Number} scaleX The size of the square in the X dimension.
			 * @param {Number} scaleY The size of the square in the Y dimension.
			 * @return {Object} rect The generated buffers for a rectangle.
			 * @see {@link squareVerticesBufferInstance}
			 * @since 0.0.5
			 */
			static generateRectangleBuffers(scaleX, scaleY) {
				var rect = {};
				
				rect.vertices = WHIP.Buffer.squareVerticesBufferInstance(scaleX, scaleY);
				rect.textureCoords = WHIP.Buffer.squareTextureBufferInstance();
				rect.indices = WHIP.Buffer.squareIndicesBufferInstance();
				
				return rect;
			}

			/**
			 * A "static" WHIP.Buffer instance representing vertex positions for a square.
			 *
			 * Argument Count and Description:
			 * 0 - Generates a square buffer with scaleX = scaleY = 1.0;
			 * 1 - Generates a square buffer with scaleX = scaleY = arguments[0]
			 * 2 - Generates a square buffer with scaleX = arguments[0] and scaleY = arguments[1]
			 *
			 * @param {Number} scaleX The size of the square in the X dimension.
			 * @param {Number} scaleY The size of the square in the Y dimension.
			 * @return {WHIP.Buffer} Vertex position buffer object.
			 * @since 0.0.1
			 */
			static squareVerticesBufferInstance(scaleX, scaleY) {
				if (scaleX === undefined && scaleY === undefined) {
					scaleX = scaleY = 1.0;
				}
				if (scaleX !== undefined && scaleY === undefined) {
					scaleY = scaleX;
				}
				var vertices = [
				   -scaleX, -scaleY,  0.0,
				    scaleX, -scaleY,  0.0,
				    scaleX,  scaleY,  0.0,
				   -scaleX,  scaleY,  0.0,
				];
				return new WHIP.Buffer(vertices, gl.ARRAY_BUFFER, gl.FLOAT, 3, 4);
			}

			/**
			 * A "static" WHIP.Buffer instance representing texture coordinates for a square.
			 * @return {WHIP.Buffer} Texture coordinate buffer object.
			 * @since 0.0.1
			 */
			static squareTextureBufferInstance() {
				var coords = [
					0.0, 0.0,
					1.0, 0.0,
					1.0, 1.0,
					0.0, 1.0,
				];
				return new WHIP.Buffer(coords, gl.ARRAY_BUFFER, gl.FLOAT, 2, 4);
			}

			/**
			 * A "static" WHIP.Buffer instance representing indices for a square.
			 * @return {WHIP.Buffer} Indices buffer object.
			 * @since 0.0.1
			 */
			static squareIndicesBufferInstance() {
				var indices = [
					0, 1, 2,
					0, 2, 3
				];
				return new WHIP.Buffer(indices, gl.ELEMENT_ARRAY_BUFFER, gl.INT, 1, 6);
			}
		}, // end buffer
		
		Mesh, // end mesh since implemented privately

	}

})(); // self-invoke