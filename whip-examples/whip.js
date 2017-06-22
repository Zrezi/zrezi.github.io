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
	 * Fullscreen boolean value.
	 * @private
	 * @type {Boolean}
	 * @since 0.0.1
	 */
	var fullscreen = false;

	/**
	 * An object that keeps track of key presses based on their .keyCode values as object keys.
	 * @private
	 * @type {Object.<Number, Boolean>}
	 * @since 0.0.1
	 */
	var currentlyPressedKeys = {};

	/**
	 * Used to fire an event only once when a key is pressed, not the entire time the key is held.
	 * @private
	 * @type {Object.<Number, Boolean>}
	 * @since 0.0.1
	 */
	var keyFlag = {};

	/**
	 * Handles the onkeydown document event.
	 * @private
	 * @param {Object} event The document's onkeydown event.
	 * @since 0.0.1
	 */
	function handleKeyDown(event) {
		currentlyPressedKeys[event.keyCode] = true;
		event.preventDefault();
	}

	/**
	 * Handles the onkeyup document event.
	 * @private
	 * @param {Object} event The document's onkeyup event.
	 * @since 0.0.1
	 */
	function handleKeyUp(event) {
		currentlyPressedKeys[event.keyCode] = false;
		keyFlag[event.keyCode] = false;
		event.preventDefault();
	}

	/**
	 * Calls all of the initialization functions.
	 * @private
	 * @since 0.0.1
	 */
	function init() {
		try {

			initGL();
			initGLStatics();
			initKeyInput();
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
	}
	
	/**
	 * Sets up keyboard input handlers.
	 * @private
	 * @since 0.0.2
	*/
	function initKeyInput() {
		
		// Key handlers
		document.onkeydown = handleKeyDown;
		document.onkeyup = handleKeyUp;

		// Initialize all keyFlags to false (instead of undefined!)
		for (var i = 0; i < 256; i++) {
			keyFlag[i] = false;
		}

		// Initialize key event keycodes
		WHIP.KEY_BACKSPACE = 8;
		WHIP.KEY_TAB = 9;
		WHIP.KEY_ENTER = 13;
		WHIP.KEY_SHIFT = 16;
		WHIP.KEY_CTRL = 17;
		WHIP.KEY_ALT = 18;
		WHIP.KEY_PAUSEBREAK = 19;
		WHIP.KEY_CAPSLOCK = 20;
		WHIP.KEY_ESC = 27;
		WHIP.KEY_SPACE = 32;
		WHIP.KEY_PAGEUP = 33;
		WHIP.KEY_PAGEDOWN = 34;
		WHIP.KEY_END = 35;
		WHIP.KEY_HOME = 36;
		WHIP.KEY_LEFT = 37;
		WHIP.KEY_UP = 38;
		WHIP.KEY_RIGHT = 39;
		WHIP.KEY_DOWN = 40;
		WHIP.KEY_INSERT = 45;
		WHIP.KEY_DELETE = 46;
		WHIP.KEY_0 = 48;
		WHIP.KEY_1 = 49;
		WHIP.KEY_2 = 50;
		WHIP.KEY_3 = 51;
		WHIP.KEY_4 = 52;
		WHIP.KEY_5 = 53;
		WHIP.KEY_6 = 54;
		WHIP.KEY_7 = 55;
		WHIP.KEY_8 = 56;
		WHIP.KEY_9 = 57;
		WHIP.KEY_A = 65;
		WHIP.KEY_B = 66;
		WHIP.KEY_C = 67;
		WHIP.KEY_D = 68;
		WHIP.KEY_E = 69;
		WHIP.KEY_F = 70;
		WHIP.KEY_G = 71;
		WHIP.KEY_H = 72;
		WHIP.KEY_I = 73;
		WHIP.KEY_J = 74;
		WHIP.KEY_K = 75;
		WHIP.KEY_L = 76;
		WHIP.KEY_M = 77;
		WHIP.KEY_N = 78;
		WHIP.KEY_O = 79;
		WHIP.KEY_P = 80;
		WHIP.KEY_Q = 81;
		WHIP.KEY_R = 82;
		WHIP.KEY_S = 83;
		WHIP.KEY_T = 84;
		WHIP.KEY_U = 85;
		WHIP.KEY_V = 86;
		WHIP.KEY_W = 87;
		WHIP.KEY_X = 88;
		WHIP.KEY_Y = 89;
		WHIP.KEY_Z = 90;
		WHIP.KEY_WINDOWS = 91;
		WHIP.KEY_RIGHTCLICK = 93;
		WHIP.KEY_NUMPAD_0 = 96;
		WHIP.KEY_NUMPAD_1 = 97;
		WHIP.KEY_NUMPAD_2 = 98;
		WHIP.KEY_NUMPAD_3 = 99;
		WHIP.KEY_NUMPAD_4 = 100;
		WHIP.KEY_NUMPAD_5 = 101;
		WHIP.KEY_NUMPAD_6 = 102;
		WHIP.KEY_NUMPAD_7 = 103;
		WHIP.KEY_NUMPAD_8 = 104;
		WHIP.KEY_NUMPAD_9 = 105;
		WHIP.KEY_NUMPAD_STAR = 106;
		WHIP.KEY_NUMPAD_PLUS = 107;
		WHIP.KEY_NUMPAD_MINUS = 109;
		WHIP.KEY_NUMPAD_PERIOD = 110;
		WHIP.KEY_NUMPAD_FORWARD_SLASH = 111;
		WHIP.KEY_F1 = 112;
		WHIP.KEY_F2 = 113;
		WHIP.KEY_F3 = 114;
		WHIP.KEY_F4 = 115;
		WHIP.KEY_F5 = 116;
		WHIP.KEY_F6 = 117;
		WHIP.KEY_F7 = 118;
		WHIP.KEY_F8 = 119;
		WHIP.KEY_F9 = 120;
		WHIP.KEY_F10 = 121;
		WHIP.KEY_F11 = 122;
		WHIP.KEY_F12 = 123;
		WHIP.KEY_NUM_LOCK = 144;
		WHIP.KEY_SCROLL_LOCK = 145;
		WHIP.KEY_COMPUTER = 182;
		WHIP.KEY_CALCULATOR = 183;
		WHIP.KEY_SEMICOLON = 186;
		WHIP.KEY_EQUALS = 187;
		WHIP.KEY_COMMA = 188;
		WHIP.KEY_DASH = 189;
		WHIP.KEY_PERIOD = 190;
		WHIP.KEY_FORWARDSLASH = 191;
		WHIP.KEY_TICK = 192;
		WHIP.KEY_SQUARE_LEFT = 219;
		WHIP.KEY_BACKSLASH = 220;
		WHIP.KEY_SQUARE_RIGHT = 221;
		WHIP.KEY_APOSTROPHE = 222;
	}
	
	/**
	 * Just some basic color definitions. Might add more...might not.
	 * @private
	 * @since 0.0.2
	*/
	function initColors() {
		WHIP.WHITE   = [ 255 / 255, 255 / 255, 255 / 255, 255 / 255 ];
		WHIP.BLACK   = [   0 / 255,   0 / 255,   0 / 255, 255 / 255 ];
		WHIP.RED     = [ 255 / 255,   0 / 255,   0 / 255, 255 / 255 ];
		WHIP.GREEN   = [   0 / 255, 255 / 255,   0 / 255, 255 / 255 ];
		WHIP.BLUE    = [   0 / 255,   0 / 255, 255 / 255, 255 / 255 ];
		WHIP.ORANGE  = [ 255 / 255, 165 / 255,   0 / 255, 255 / 255 ];
		WHIP.YELLOW  = [ 255 / 255, 255 / 255,   0 / 255, 255 / 255 ];
		WHIP.CYAN    = [   0 / 255, 255 / 255, 255 / 255, 255 / 255 ];
		WHIP.FUCHSIA = [ 255 / 255,   0 / 255, 255 / 255, 255 / 255 ];
		WHIP.PURPLE  = [ 127 / 255,   0 / 255, 127 / 255, 255 / 255 ];
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
			WHIPPostInit()
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
		 * @since 0.0.1
		 */
		setFullscreen: function(val) {
			fullscreen = val;
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
		 * This function can take either an array of 4 colors (RGBA), or 4 individual parameters r, g, b, a.
		 * @param {Number} r The red component of the clear color.
		 * @param {Number} g The green component of the clear color.
		 * @param {Number} b The blue component of the clear color.
		 * @param {Number} a The alpha component of the clear color.
		 * @throw {IllegalArgumentException} Wrong number of colors supplied to the call as an array.
		 * @throw {IllegalArgumentException} Wrong number of colors supplied to the call as individual values.
		 * @since 0.0.1
		 */
		setClearColor: function(r /* ... */ ) {
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
		 * Determines whether or not the key is currently pressed.
		 * @param {Number} key The keyCode of the key.
		 * @return {Boolean} whether or not the key is pressed.
		 * @since 0.0.1
		 */
		ifKeyHeld: function(key) {
			return (currentlyPressedKeys[key]) ? true : false;
		},

		/**
		 * Determines whether or not the key was currently pressed.
		 * When true, it sets a flag and won't fire again until the key is released.
		 * @param {Number} key The keyCode of the key.
		 * @return {Boolean} whether or not the key was pressed.
		 * @since 0.0.1
		 */
		ifKeyPressed: function(key) {
			var value = false;
			if (currentlyPressedKeys[key] && keyFlag[key] == false) {
				value = true;
				keyFlag[key] = true;
			}
			return value;
		},

		/**
		 * Wrapper for gl.drawElements(...)
		 * @param {Number} style The drawing mode.
		 * @param {Number} itemCount The number of items to draw.
		 * @since 0.0.1
		 */
		drawElements: function(style, itemCount) {
			/*if (
				style == WHIP.POINTS ||
				style == WHIP.LINES ||
				style == WHIP.LINE_STRIP ||
				style == WHIP.LINE_LOOP ||
				style == WHIP.TRIANGLES ||
				style == WHIP.TRIANGLE_STRIP ||
				style == WHIP.TRIANGLE_FAN
			) {*/
				gl.drawElements(style, itemCount, gl.UNSIGNED_SHORT, 0);
			/*} else {
				throw new Error("Drawing mode \"" + style + "\" is not valid. Try WHIP.TRIANGLES.");
			}*/
		},

		/**
		 * Wrapper for gl.drawArrays(...)
		 * @param {Number} style The drawing mode.
		 * @param {Number} itemCount The number of items to draw.
		 * @since 0.0.1
		 */
		drawArrays: function(style, itemCount) {
			/*if (
				style == WHIP.POINTS ||
				style == WHIP.LINES ||
				style == WHIP.LINE_STRIP ||
				style == WHIP.LINE_LOOP ||
				style == WHIP.TRIANGLES ||
				style == WHIP.TRIANGLE_STRIP ||
				style == WHIP.TRIANGLE_FAN
			) {*/
				gl.drawArrays(style, 0, itemCount);
			/*} else {
				throw new Error("Drawing mode \"" + style + "\" is not valid. Try WHIP.TRIANGLES.");
			}*/
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
					alert("Could not initialise shaders");
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
					throw "Attribute is null or undefined!";
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
			 * Set a key of the object equal to the WebGL uniform location call.
			 * @param {String} uniform The uniform name.
			 * @since 0.0.1
			 */
			addUniform(uniform) {
				this[uniform] = gl.getUniformLocation(this.glProgram, uniform);
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
			setUniform(uniformType, uniformName, value) {
				switch (uniformType) {
					case "1i":
						gl.uniform1i(this.getUniform(uniformName), value);
						break;
					case "1f":
						gl.uniform1f(this.getUniform(uniformName), value);
						break;
					case "2f":
						gl.uniform2f(this.getUniform(uniformName), value);
						break;
					case "3f":
						gl.uniform3f(this.getUniform(uniformName), value);
						break;
					case "4f":
						gl.uniform4f(this.getUniform(uniformName), value);
						break;
					case "1iv":
						gl.uniform1iv(this.getUniform(uniformName), value);
						break;
					case "3iv":
						gl.uniform3iv(this.getUniform(uniformName), value);
						break;
					case "1fv":
						gl.uniform1fv(this.getUniform(uniformName), value);
						break;
					case "2fv":
						gl.uniform2fv(this.getUniform(uniformName), value);
						break;
					case "3fv":
						gl.uniform3fv(this.getUniform(uniformName), value);
						break;
					case "4fv":
						gl.uniform4fv(this.getUniform(uniformName), value);
						break;
					case "Matrix3fv":
						gl.uniformMatrix3fv(this.getUniform(uniformName), false, value);
						break;
					case "Matrix4fv":
						gl.uniformMatrix4fv(this.getUniform(uniformName), false, value);
						break;
					default:
						throw new Error("Uniform type \"" + uniformType + "\" is not a valid uniform type.");
						break;
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
					alert(gl.getShaderInfoLog(shader));
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
				if (slot < 33984 || slot > 34015) {
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

				if (bufferType == gl.ELEMENT_ARRAY_BUFFER || bufferType == gl.ARRAY_BUFFER) {
					this.bufferType = bufferType;
				} else {
					throw new Error("WebGLBuffer buffer type \"" + bufferType + "\" not supported. Use gl.ELEMENT_ARRAY_BUFFER or gl.ARRAY_BUFFER");
					return;
				}

				gl.bindBuffer(this.bufferType, this.glBuffer);

				if (arrayType == gl.FLOAT) {
					gl.bufferData(this.bufferType, new Float32Array(bufferData), gl.STATIC_DRAW);
				} else if (arrayType == gl.INT) {
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
			 * A "static" WHIP.Buffer instance representing vertex positions for a square.
			 * @return {WHIP.Buffer} Vertex position buffer object.
			 * @since 0.0.1
			 */
			static squareVerticesBuffer() {
				var vertices = [
				   -1.0, -1.0, 1.0,
				    1.0, -1.0, 1.0,
				    1.0, 1.0, 1.0,
				   -1.0, 1.0, 1.0,
				];
				return new WHIP.Buffer(vertices, gl.ARRAY_BUFFER, gl.FLOAT, 3, 4);
			}

			/**
			 * A "static" WHIP.Buffer instance representing texture coordinates for a square.
			 * @return {WHIP.Buffer} Texture coordinate buffer object.
			 * @since 0.0.1
			 */
			static squareTextureBuffer() {
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
			static squareIndicesBuffer() {
				var indices = [
					0, 1, 2,
					0, 2, 3
				];
				return new WHIP.Buffer(indices, gl.ELEMENT_ARRAY_BUFFER, gl.INT, 1, 6);
			}
		} // end buffer

	}

})(); // self-invoke