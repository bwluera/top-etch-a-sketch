let app = {
  currentSize: "MEDIUM",
  sizeValues: {
    SMALL: null,
    MEDIUM: null,
    LARGE: null,
  },
  canvasPixels: [],

  onPixelMouseDown(pixelElement) {
    pixelElement.style.backgroundColor = this.getCurrentColor();

    this.mousePressed = true;
  },

  onPixelMouseEnter(pixelElement, pressedButtons) {
    if (!(pressedButtons % 2 == 1)) {
      return;
    }

    pixelElement.style.backgroundColor = this.getCurrentColor();
  },

  onResetClick() {
    for (let pixel of this.canvasPixels) {
      pixel.style.backgroundColor = "#ffffff";
    }
  },

  onChangeSizeClick(button) {
    if (this.currentSize === "SMALL") {
      this.currentSize = "MEDIUM";
    } else if (this.currentSize === "MEDIUM") {
      this.currentSize = "LARGE";
    } else {
      this.currentSize = "SMALL";
    }

    this.drawCanvas();

    const sizeLetter = this.currentSize.charAt(0);

    button.textContent = button.textContent.slice(0, -1) + sizeLetter;
  },

  getRandomColor() {
    const possibleValues = 16 ** 6;

    const hexValue = Math.floor(Math.random() * possibleValues).toString(16);

    return `#${hexValue}`;
  },

  getCurrentColor() {
    const colorPicker = document
      .getElementsByClassName("drawing-color-picker-button")
      .item(0);

    return colorPicker.value;
  },

  drawCanvas() {
    if (this.canvasPixels.length !== 0) {
      for (let pixel of this.canvasPixels) {
        pixel.remove();
      }
    }

    const numericalPixelSize = this.pixelStringToInt(
      this.sizeValues[this.currentSize]
    );
    const possibleRowsCols = 405 / numericalPixelSize;

    const drawingCanvas = document
      .getElementsByClassName("drawing-canvas")
      .item(0);

    const currentSize = this.currentSize.toLowerCase();

    for (let i = 0; i < possibleRowsCols; i++) {
      const pixelRow = document.createElement("div");
      pixelRow.classList.add("draw-pixel-row", "flex-row");
      drawingCanvas.appendChild(pixelRow);

      for (let j = 0; j < possibleRowsCols; j++) {
        const pixel = document.createElement("div");
        pixel.classList.add(`draw-pixel-${currentSize}`);

        pixel.addEventListener("mousedown", () => {
          this.onPixelMouseDown(pixel);
        });

        pixel.addEventListener("mouseenter", (event) => {
          this.onPixelMouseEnter(pixel, event.buttons);
        });

        this.canvasPixels.push(pixel);

        pixelRow.appendChild(pixel);
      }
    }
  },

  resetCanvas() {
    for (let pixel of this.canvasPixels) {
      pixel.style.backgroundColor = "#ffffff";
    }
  },

  pixelStringToInt(str) {
    return parseInt(str.slice(0, -2));
  },

  init() {
    const computedStyle = getComputedStyle(document.documentElement);

    this.sizeValues.SMALL = computedStyle.getPropertyValue(
      "--draw-pixel-small-size"
    );
    this.sizeValues.MEDIUM = computedStyle.getPropertyValue(
      "--draw-pixel-medium-size"
    );
    this.sizeValues.LARGE = computedStyle.getPropertyValue(
      "--draw-pixel-large-size"
    );

    const body = document.getElementsByName("body").item(0);

    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    const colorPicker = document
      .getElementsByClassName("drawing-color-picker-button")
      .item(0);
    const colorPickerVisual = document
      .getElementsByClassName("drawing-color-picker-aesthetic")
      .item(0);

    colorPicker.addEventListener("change", () => {
      colorPickerVisual.style.backgroundColor = colorPicker.value;
    });

    const changeSizeButton = document
      .getElementsByClassName("drawing-size-change")
      .item(0);

    const resetButton = document
      .getElementsByClassName("drawing-reset")
      .item(0);

    changeSizeButton.addEventListener("click", () => {
      this.onChangeSizeClick(changeSizeButton);
    });

    resetButton.addEventListener("click", () => {
      this.onResetClick();
    });

    this.drawCanvas();
  },
};

app.init();
