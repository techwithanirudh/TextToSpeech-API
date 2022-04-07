window.talker = new AniSpeech();

document.getElementById("speak").addEventListnener("click", function (event) {
  event.preventDefault();
  var text = document.getElementById("input#text[name='text']").value;
  talker.speak(text);
});
