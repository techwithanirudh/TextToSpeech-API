// TODO:
// Sort default by first
// AniSpeechUttenrace with pich and vloume
// Onvoicechange method
// HARDEST: Add UI

class AniSpeechUtterance {
	constructor() {
    this.text = '';
	this.lang = '';
	this.voice = null;
	
	this.onstart = function() {};
	this.onend = function() {};
	this.onpause = function() {};
	this.onresume = function() {};

	// Not yet implemented
    this.pitch = -1;
    this.rate = -1;
    this.volume = -1;
	
  }
}

class AniSpeechVoice {
  constructor({ _default, language, localService, name, voiceURI }) {
    this.default = _default;
    this.lang = language;
    this.localService = localService;
    this.name = name;
    this.voiceURI = voiceURI;
	this.utterance = null;
  }
}

class AniSpeech {
  constructor(language) {
    this.language = "en";
	this.voice = new AniSpeechVoice(true, 'en', false, 'Google Speech Online English', 'Google Speech Online English');
    this.languages = {
      af: "Afrikaans",
      ar: "Arabic",
      bg: "Bulgarian",
      bn: "Bengali",
      bs: "Bosnian",
      ca: "Catalan",
      cs: "Czech",
      cy: "Welsh",
      da: "Danish",
      de: "German",
      el: "Greek",
      en: "English",
      eo: "Esperanto",
      es: "Spanish",
      et: "Estonian",
      fi: "Finnish",
      fr: "French",
      gu: "Gujarati",
      hi: "Hindi",
      hr: "Croatian",
      hu: "Hungarian",
      hy: "Armenian",
      id: "Indonesian",
      is: "Icelandic",
      it: "Italian",
      iw: "Hebrew",
      ja: "Japanese",
      jw: "Javanese",
      km: "Khmer",
      kn: "Kannada",
      ko: "Korean",
      la: "Latin",
      lv: "Latvian",
      mk: "Macedonian",
      ml: "Malayalam",
      mr: "Marathi",
      ms: "Malay",
      my: "Myanmar (Burmese)",
      ne: "Nepali",
      nl: "Dutch",
      no: "Norwegian",
      pl: "Polish",
      pt: "Portuguese",
      ro: "Romanian",
      ru: "Russian",
      si: "Sinhala",
      sk: "Slovak",
      sq: "Albanian",
      sr: "Serbian",
      su: "Sundanese",
      sv: "Swedish",
      sw: "Swahili",
      ta: "Tamil",
      te: "Telugu",
      th: "Thai",
      tl: "Filipino",
      tr: "Turkish",
      uk: "Ukrainian",
      ur: "Urdu",
      vi: "Vietnamese",
      "zh-CN": "Chinese",
    };
    this.getLanguages();
    this.pending = false;
    this.speaking = false;
    this.paused = false;
    this.audio = null;
  }

  async getLanguages() {
    var languages = await fetch("https://texttospeech-api.techwithanirudh.repl.co/api/v1/languages/");
    languages = await languages.json();

    this.languages = languages;

    return languages;
  } 

  getName(language) {
    language = this.languages[language];
    const name = `Google Speech Online ${language}`;

    return name;
  }

  getVoices() {
    var languages = Object.keys(this.languages);

    var voices = [];

    languages.forEach((language) => {
      var _default = false;
      var lang = language;
      var localService = false;
      var name = this.getName(language);
      var voiceURI = this.getName(language);

      if (language === "en") var _default = true;

      var voice = {
        _default: _default,
        language: language,
        localService: localService,
        name: name,
        voiceURI: voiceURI,
      };
      voices.push(new AniSpeechVoice(voice));
    });

    return voices;
  }

  async speak(utterance) {
    const self = this;
	
	if (typeof utterance === 'string') {
		var text = utterance;
		utterance = new AniSpeechUtterance;
		utterance.text = text;
		
		utterance.lang = this.language;
		utterance.voice = this.voice;
		
		utterance.pitch = 1;
		utterance.rate = 1;
		utterance.volume = 1;
	}

	this.utterance = utterance;
	  
	var speakingLanguage = ''
	if (utterance.voice) {
		if (utterance.voice.lang) speakingLanguage = utterance.voice.lang
	} else if (utterance.language !== '') {
		speakingLanguage = utterance.lang
	} else {
		speakingLanguage = this.voice.lang || this.language
	}
	  
    const response = await fetch("https://texttospeech-api.techwithanirudh.repl.co/api/v1/speak/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: utterance.text,
        language: speakingLanguage,
      }),
    });

    const audioBlob = await response.blob();
    const audioUrl = window.URL.createObjectURL(audioBlob);

    const audio = document.createElement("audio");
    this.audio = audio;

    audio.src = audioUrl;
    audio.play();
    this.speaking = true;
	utterance.onstart();

    audio.onended = function () {
      self.speaking = false;
	  utterance.onend();
    };

    return this.audio;
  }

  pause() {
    this.audio.pause();
	this.utterance.onpause();
  }

  resume() {
    this.audio.play();
	this.utterance.onresume();
  }

  cancel() {
    this.audio.pause();
    this.audio.remove();
	this.utterance.onend();
  }
}