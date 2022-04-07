window.talker = new AniSpeech();

document.querySelector('button#speak[name="speak"]').addEventListener("click", function (event) {
  event.preventDefault();
  var text = document.querySelector('input#text[name="text"]').value;
  talker.speak(text);
});
