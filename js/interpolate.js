var interpolate = (function() {
	function interpolate_string(obj) {
		for (var i = 0; i < obj.steps; i++) {
			if (obj.element.innerHTML != obj.interpolate) {
			
				var name_text = obj.element.innerHTML;
				
				while (name_text.charAt(name_text.length - obj.offset) === obj.interpolate.charAt(obj.interpolate.length - obj.offset)) {
					obj.offset++;
				}
				
				if (name_text.length == obj.interpolate.length) {
					obj.element.innerHTML = do_character(name_text, obj.interpolate, obj.offset);
					
					
				} else if (name_text.length < obj.interpolate.length) { // what you have is smaller than what you're going to
					if (obj.offset <= name_text.length) {
						obj.element.innerHTML = do_character(name_text, obj.interpolate, obj.offset);
					} else {
						var preserved = obj.element.innerHTML;
						obj.element.innerHTML = String.fromCharCode(randInt(65, 90)) + preserved;
					}
				} else if (name_text.length > obj.interpolate.length) { // what you have is larger than what you're going to
					if (obj.offset <= obj.interpolate.length) {
						obj.element.innerHTML = do_character(name_text, obj.interpolate, obj.offset);
					} else {
						var new_ttit = "";
						for (var j = 0; j < name_text.length - obj.interpolate.length; j++) {
							new_ttit += " ";
						}
						new_ttit += obj.interpolate;
						obj.interpolate = new_ttit;
					}
				}
				
			}
			
		} // end for loop
	}

	function do_character(name_text, interpolate, offset) {
		if (offset <= interpolate.length) {
					
			var char_code = name_text.charCodeAt(name_text.length - offset);
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
			
			var preserved_before = name_text.substring(0, name_text.length - offset);
			var preserved_after = name_text.substring(name_text.length - offset + 1);
			
			name_text = "";
			name_text += preserved_before;
			name_text += String.fromCharCode(char_code);
			name_text += (preserved_after != "") ? preserved_after : "";
			
			return name_text;
		}
	}

	function randInt(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	}
	
	return {
		string: function(obj) {
			interpolate_string(obj);
		}
	}
})();