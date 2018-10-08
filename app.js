window.onload = init;

function mixColors(colorObjects) {
    /* Get the sums of the red, blue, and green components 
       of all colors passed in and store them in an array.
    */
    let mixedColorComponents = colorObjects
        .reduce(
            function (accumulator, currentColor) {
                var currentColorComponents = currentColor.getComponents();
                return accumulator.map(function (value, i) {
                    return value + currentColorComponents[i];
                })
            }, [0, 0, 0]
        );

    /* If any color component is over 255, reduce them all 
       such that the relative proportions are the same but
       none go over 255.
    */
    var maxComponent = Math.max(...mixedColorComponents);

    if (maxComponent > 255) {
        var componentMultiplier = 255 / maxComponent;
        mixedColorComponents = mixedColorComponents.map(function (component) {
            return Math.round(component * componentMultiplier);
        })
    }

    /* Build a new Color object with the final calculated 
       component values, then return it.
    */
    return new Color(
        mixedColorComponents[0],
        mixedColorComponents[1],
        mixedColorComponents[2]
    );
}

function Color(red, green, blue) {

    this.getRGBString = function () {
        return `rgb(${red},${green},${blue})`;
    }
    this.getHexString = function () {
        var hexStringBuilder = ['#'];
        for(let value of this.getComponents()) {
            hexStringBuilder.push(value.toString(16).toUpperCase().padStart(2, '0'))
        }
        return hexStringBuilder.join('');
    }

    this.setColor = function (red, green, blue) {
        this._red = red;
        this._green = green;
        this._blue = blue;
    }

    this.getComponents = function () {
        return [this._red, this._green, this._blue];
    }

    this.setColor(red, green, blue);

    this.isColor = function (colorObj) {
        var colorComponents = colorObj.getComponents();
        return this._red === colorComponents[0] &&
            this._green === colorComponents[1] &&
            this._blue === colorComponents[2]
    }
}

function Mixer(element) {
    this._colors = [];
    this._element = element;
    var mixerPreview = document.createElement("div");
    mixerPreview.className = "mixer-preview";
    var mixerOutput = document.createElement("div");
    mixerOutput.className = "mixer-output";
    this._element.appendChild(mixerPreview);
    this._element.appendChild(mixerOutput);

    this.displayMixedColors = function () {
        var mixedColor = mixColors(this._colors);
        var rgbString = mixedColor.getRGBString();
        mixerPreview.style.background = rgbString;
        mixerOutput.innerText = `${rgbString}\n${mixedColor.getHexString()}`;
    };

    this.addColor = function (color) {
        this._colors.push(color);
        this.displayMixedColors();
    };

    this.removeColor = function (color) {
        var colorIndex = this._colors.findIndex(function (existingColor) {
            return existingColor.isColor(color)
        });
        if (colorIndex >= 0) {
            this._colors.splice(colorIndex, 1)
            this.displayMixedColors();
        }
    }

    this.displayMixedColors();
}

function buildSwatchElement(color, mixer) {
        var swatchElement = document.createElement('label');
        swatchElement.className = "swatch";

        var colorElement = document.createElement('div');
        colorElement.style.background = color.getRGBString();

        var colorCheckbox = document.createElement('input');
        colorCheckbox.type = "checkbox";

        var currentColor = color;
        colorCheckbox.onchange = function (e) {
            if (e.target.checked) {
                swatchElement.className = "swatch selected";
                mixer.addColor(currentColor)
            } else {
                swatchElement.className = "swatch";
                mixer.removeColor(currentColor)
            }
        }

        swatchElement.appendChild(colorElement);
        swatchElement.appendChild(colorCheckbox);

        return swatchElement;
}

function init() {

    // Hard-code three basic colors
    var red = new Color(255, 0, 0);
    var green = new Color(0, 255, 0);
    var blue = new Color(0, 0, 255);
    var cyan = new Color(0, 255, 255);
    var magenta = new Color(255, 0, 255);
    var yellow = new Color(255,255,0);

    // Mount the app to the element with the id "app"
    var appElement = document.getElementById('app');

    // Make the mixer
    var mixerElement = document.createElement('div');
    mixerElement.id = "mixer";
    var mixer = new Mixer(mixerElement);

    // Make the Palette
    var primaryColors = [red, green, blue];
    var secondaryColors = [cyan, magenta, yellow];

    var paletteElement = document.createElement('div');
    var primaryColorsContainer = document.createElement('div');
    var secondaryColorsContainer = document.createElement('div');
    paletteElement.id = "palette";

    for (let color of primaryColors) {
        primaryColorsContainer.appendChild(buildSwatchElement(color, mixer));
    }
    for (let color of secondaryColors) {
        secondaryColorsContainer.appendChild(buildSwatchElement(color, mixer));
    }
    paletteElement.appendChild(primaryColorsContainer);
    paletteElement.appendChild(secondaryColorsContainer);

    // Put the fully build app pieces on the app element.
    appElement.appendChild(paletteElement);
    appElement.appendChild(mixerElement);
}