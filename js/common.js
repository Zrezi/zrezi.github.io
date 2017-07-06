const VERSION            = "0706172";
const FADE_OUT_CSS_CLASS = "fade-out-wrapper";
const FADE_IN_CSS_CLASS  = "fade-in-wrapper";
const FOOTER_ID          = "footer-text";

var Interpolate = (function() {
	
	function int_str(obj) {
		
		// The string and the string to interpolate to are equal, so we can return
		if (obj.element.innerHTML == obj.stringToInterpolateTo) {
			return;
		}
		
		if (!obj.steps) {
			obj.steps = 5;
		}
		
		var offset = 0;
		
		// Run 'step' number of times
		for (var i = 0; i < obj.steps; i++) {
			
			// Get the curent status of the element's string after every loop
			var elementString = obj.element.innerHTML;
			
			// Check again if the strings are not equal
			if (elementString != obj.stringToInterpolateTo) {
				
				// Skip any characters that are equal
				while (elementString.charAt(elementString.length - offset) === obj.stringToInterpolateTo.charAt(obj.stringToInterpolateTo.length - offset)) {
					offset++;
				}
				
				// Different things happen based on the length of the two strings
				if (elementString.length == obj.stringToInterpolateTo.length) {
					
					// If the string lengths are equal, we don't need to worry about adding or subtracting
					// characters, so we can just do a direct character swap
					obj.element.innerHTML = interpolateCharacter(elementString, obj.stringToInterpolateTo, offset);
					
				// If the string we have is shorter than the string we want to interpolate to
				} else if (elementString.length < obj.stringToInterpolateTo.length) {
					
					// If the "current character we are messing with"'s position is within the length of the
					// string we want to interpolate to, we can again just do a regular 1-1 character swap
					if (offset <= elementString.length) {
						obj.element.innerHTML = interpolateCharacter(elementString, obj.stringToInterpolateTo, offset);
						
					// ...but if the position is outside the length of the string we started with, we need to
					// add a random letter to the front of the string. On the next run, the offset will be "within"
					// the length of the string and the offset will be <= the length
					} else {
						var preserved = obj.element.innerHTML;
						obj.element.innerHTML = String.fromCharCode(randInt(65, 90)) + preserved;
					}
					
				// If the string we have is longer than the string we want to interpolate to
				} else if (elementString.length > obj.stringToInterpolateTo.length) {
					
					// Similarly, if the position is within the string we want to interpolate to's length
					// then we can 1-1 swap
					if (offset <= obj.stringToInterpolateTo.length) {
						obj.element.innerHTML = interpolateCharacter(elementString, obj.stringToInterpolateTo, offset);
						
					// Otherwise we take advantage of the fact that browsers only render 1 space even if there
					// are multiple spaces in the string. We artificially lengthen the string we're interpolating
					// to by filling it with spaces. That way the two strings are "technically" the same length,
					// but we only display the characters from the interpolated string and not the extra spaces.
					// It's hacky, but it works.
					} else {
						var newInterpolatedString = "";
						for (var j = 0; j < elementString.length - obj.stringToInterpolateTo.length; j++) {
							newInterpolatedString += " ";
						}
						newInterpolatedString += obj.stringToInterpolateTo;
						obj.stringToInterpolateTo = newInterpolatedString;
					}
				}
				
			}
			
		} // end for loop
	}

	function interpolateCharacter(elementString, interpolate, offset) {
		
		if (offset <= interpolate.length) {
					
			var char_code = elementString.charCodeAt(elementString.length - offset);
			if (interpolate.charCodeAt(interpolate.length - offset) > char_code) {
				char_code++;
				if (char_code < 65) {
					char_code = 65;
				}
				if (90 < char_code && char_code < 97) {
					char_code = 97;
				}
			} else {
				char_code--;
				if (90 < char_code && char_code < 97) {
					char_code = 90;
				}
				if (interpolate.charCodeAt(interpolate.length - offset) == 32 && char_code < 65) {
					char_code = 32;
				}
			}
			
			var preserved_before = elementString.substring(0, elementString.length - offset);
			var preserved_after = elementString.substring(elementString.length - offset + 1);
			
			elementString = "";
			elementString += preserved_before;
			elementString += String.fromCharCode(char_code);
			elementString += (preserved_after != "") ? preserved_after : "";
			
			return elementString;
		}
	}

	function randInt(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	}
	
	return {
		string: function(obj) {
			int_str(obj);
		}
	}
})();

var Common = (function() {
	
	var wrapper;

	return {
		initPage: function() {
			window.onunload = function() {};
			
			var a = document.createElement("a");
			a.innerHTML = VERSION;
			a.href = "";
			a.onclick = function(event) {
				event.preventDefault();
				window.location = "/pages/programminglog.html";
			}
			document.getElementById(FOOTER_ID).appendChild(a);
			
			wrapper = document.getElementById("fading-wrapper");
		},
		
		fadeToPage: function(path) {
			wrapper.style.opacity = 1;
			Common.fadePageOut();
			wrapper.onanimationend = function() {
				wrapper.style.opacity = 0;
				window.location = path;
			};
		},
		
		fadePageIn: function() {
			wrapper.classList.remove(FADE_OUT_CSS_CLASS);
			wrapper.classList.add(FADE_IN_CSS_CLASS);
		},
		
		fadePageOut: function() {
			wrapper.classList.remove(FADE_IN_CSS_CLASS);
			wrapper.classList.add(FADE_OUT_CSS_CLASS);
		},
		
		geid: function(id) {
			return document.getElementById(id);
		}
	};
})();