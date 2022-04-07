from flask import *
from flask_cors import CORS

from werkzeug.utils import secure_filename
from gtts import gTTS, langs
from uuid import uuid4

import os, shutil

app = Flask(__name__)
CORS(app)

if os.path.isdir('./files'):
	shutil.rmtree('./files')
os.mkdir('./files')

@app.route('/')
def index():
  	return render_template('index.html')

@app.route('/api/v1/languages/')
def languages():
	supportedLanguages = langs._main_langs()
	return supportedLanguages

@app.route('/api/v1/speak/', methods=['GET', 'POST'])
def read():
	if request.method == 'POST':
		request_data = request.json
		filename = f"./files/{secure_filename(str(uuid4()))}.mp3"
		
		text = request_data['text'] or 'Hello World!'
		language = request_data['language'] or 'en'

		try:
			ttsEngine = gTTS(text=text, lang=language, slow=False)
		except ValueError:
			return "Language not supported: " + language
	
		ttsEngine.save(filename)

		return send_file(filename, mimetype='audio/mp3')
	elif request.method == 'GET':  
		return redirect('/')

app.run(host='0.0.0.0', port=8080)
