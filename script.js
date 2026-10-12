const MODEL_URL = "https://teachablemachine.withgoogle.com/models/KC8g7OCWP/";

let model, webcam, labelContainer, maxPredictions;

document.getElementById("start-btn").addEventListener("click", init);

async function init() {
  const button = document.getElementById("start-btn");
  button.disabled = true;
  button.textContent = "Loading...";

  // Load the model
  model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
  maxPredictions = model.getTotalClasses();

  // Set up the webcam (width, height, flip)
  webcam = new tmImage.Webcam(300, 300, true);
  await webcam.setup();
  await webcam.play();
  document.getElementById("webcam-container").appendChild(webcam.canvas);

  // Create one line per class
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  button.textContent = "Camera Running";
  window.requestAnimationFrame(loop);
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const percent = (prediction[i].probability * 100).toFixed(0);
    labelContainer.childNodes[i].textContent =
      prediction[i].className + ": " + percent + "%";
  }
}