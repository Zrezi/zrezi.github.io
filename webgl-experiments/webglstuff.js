/**
 * The global WebGL Context.
 * @global
 * @type {WebGLRenderingContext}
 * @since 0.0.1
*/
var gl;

/**
 * The global Canvas element reference.
 * @global
 * @type {Element}
 * @since 0.0.1
*/
var canvas;

/**
 * A wrapper for a general case WebGL Shader Program.
 * @since 0.0.1
*/
class WebGLShaderProgram {
	constructor(type /* ... */) {
		if (type == "script-element") {
			if (arguments.length != 3) {
				throw "No script element IDs provided to WebGLShader";
			}
			
			var fragment = this.compileShaderFromScriptElement(arguments[1]);
			var vertex = this.compileShaderFromScriptElement(arguments[2]);
			
			this.glProgram = gl.createProgram();
			gl.attachShader(this.glProgram, fragment);
			gl.attachShader(this.glProgram, vertex);
			gl.linkProgram(this.glProgram);

			if (!gl.getProgramParameter(this.glProgram, gl.LINK_STATUS)) {
				alert("Could not initialise shaders");
			}
		} else {
			throw "That WebGLShaderProgram type is not supported!";
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
	 * @since 0.0.1
	*/
	addAttribute(attrib) {
		this[attrib] = gl.getAttribLocation(this.glProgram, attrib);
	}
	
	/**
	 * Return the attribute location if it exists and has been added prior to this call.
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
	 * @since 0.0.1
	*/
	enableAttribute(attrib) {
		gl.enableVertexAttribArray(this.getAttribute(attrib));
	}
	
	/**
	 * Disables an attribute array given an attribute name. Used to tell WebGL about shaders with less attributes.
	 * @see {@link https://stackoverflow.com/questions/9705771/conflict-when-using-two-or-more-shaders-with-different-number-of-attributes?rq=1}
	 * @since 0.0.1
	*/
	disableAttribute(attrib) {
		gl.disableVertexAttribArray(this.getAttribute(attrib));
	}
	
	/**
	 * Tells WebGL how many bytes represent each vertex, represented by a specific attribute array.
	 * @since 0.0.1
	*/
	attributePointer(attrib, itemSize) {
		gl.vertexAttribPointer(this.getAttribute(attrib), itemSize, gl.FLOAT, false, 0, 0);
    }
	
	/**
	 * Set a key of the object equal to the WebGL uniform location call.
	 * @since 0.0.1
	*/
	addUniform(uniform) {
		this[uniform] = gl.getUniformLocation(this.glProgram, uniform);
	}
	
	/**
	 * Return the uniform location if it exists and has been added prior to this call.
	 * @return {Number} this[uniform] The value of the uniform key, if it exists.
	 * @since 0.0.1
	*/
	getUniform(uniform) {
		if (this[uniform] == null || this[uniform] == undefined) {
			throw "Uniform is null or undefined!";
			return null;
		}
		return this[uniform];
	}
	
	setUniformMatrix4fv(uniform, value) {
		gl.uniformMatrix4fv(this.getUniform(uniform), false, value);
	}
	
	setUniformMatrix3fv(uniform, value) {
		gl.uniformMatrix3fv(this.getUniform(uniform), false, value);
	}
	
	setUniform1i(uniform, value) {
		gl.uniform1i(this.getUniform(uniform), false, value);
	}
	
	setUniform1f(uniform, value) {
		gl.uniform1f(this.getUniform(uniform), false, value);
	}
	
	/**
	 * Compiles a WebGLShader from a <script> element in HTML.
	 * @return {WebGLShader} shader The compiled shader.
	 * @since 0.0.1
	*/
	compileShaderFromScriptElement(id) {
		var shaderScript = document.getElementById(id);
		
        if (!shaderScript) {
			throw "Script element " + id + " doesn't exist.";
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
	}
}

/**
 * A wrapper for the WebGL Texture unit.
 * @since 0.0.1
*/
class WebGLTexture {
	constructor(imagePath) {
		if (!imagePath) {
			throw "Texture filepath not given.";
		}
		
		this.glTexture = gl.createTexture();
		this.image = new Image();
		this.image.src = imagePath;
		var self = this;
		this.image.onload = function() {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.bindTexture(gl.TEXTURE_2D, self.glTexture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			self.isLoaded = true;
		}
		this.image.onerror = function() {
			throw "Error loading image from path: " + imagePath;
		}
		
		this.isLoaded = false;
	}
	
	/**
	 * Binds this texture.
	 * @since 0.0.1
	*/
	bind(slot) {
		if (!slot || !parseInt(slot) || slot < 33984 || slot > 34015) {
			throw "Texture slot failure. Please use gl.TEXTURE0 through gl.TEXTURE31";
		}
		gl.activeTexture(slot);
		gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
	}
	
	/**
	 * Unbinds this texture.
	 * @since 0.0.1
	*/
	unbind() {
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}

/**
 * A wrapper for a WebGL array buffer or a WebGL element array buffer.
 * @since 0.0.1
*/
class WebGLBuffer {
	constructor(bufferData, bufferType, arrayType, itemSize, itemCount) {
		
		if (bufferType == gl.ELEMENT_ARRAY_BUFFER || bufferType == gl.ARRAY_BUFFER) {
			this.bufferType = bufferType;
		} else {
			throw "WebGLBuffer buffer type " + bufferType + " not supported. Use gl.ELEMENT_ARRAY_BUFFER or gl.ARRAY_BUFFER";
			return;
		}
		
		this.glBuffer = gl.createBuffer();
        gl.bindBuffer(this.bufferType, this.glBuffer);
		
		if (arrayType == gl.FLOAT) {
			gl.bufferData(this.bufferType, new Float32Array(bufferData), gl.STATIC_DRAW);
		} else if (arrayType == gl.INT) {
			gl.bufferData(this.bufferType, new Uint16Array(bufferData), gl.STATIC_DRAW);
		} else {
			throw "WebGLBuffer array type " + arrayType + " not supported. Use gl.FLOAT or gl.INT";
			return;
		}
		
        this.itemSize = itemSize;
        this.itemCount = itemCount;
	}
	
	/**
	 * Binds this buffer as the appropriate type.
	 * @since 0.0.1
	*/
	bind() {
		gl.bindBuffer(this.bufferType, this.glBuffer);
	}
	
	static squareVerticesBuffer() {
		return [
			-1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
		];
	}
	
	static squareTextureBuffer() {
		return [
            0.0, 0.0,
			1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
		];
	}
	
	static squareIndicesBuffer() {
		return [ 0, 1, 2, 0, 2, 3 ];
	}
}


/**
 * Grabs the WebGL context from the canvas DOM element.
 * @since 0.0.1
*/
function InitGL() {
	try {
		gl = canvas.getContext("webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
		throw e;
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

/**
 * Entry point for the page. Initializes everything and starts the loop.
 * @since 0.0.1
*/
function WebGLStart() {
	canvas = document.getElementById("webgl-canvas");
	console.log(canvas);
	InitGL();
	initShaders();
	initBuffers();
	initTexture();

	gl.clearColor(0.4, 0.8, 1.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	
	tick();
}






