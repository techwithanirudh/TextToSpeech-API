from flask import *
from flask_cors import CORS

from werkzeug.utils import secure_filename
from gtts import gTTS
from uuid import uuid4

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
  	return render_template('index.html')

@app.route('/api/v1/speak/', methods=['GET', 'POST'])
def read():
	if request.method == 'POST':
		request_data = request.json
		filename = f"./files/{secure_filename(str(uuid4()))}.mp3"
		
		text = request_data['text'] or 'Hello World!'
		language = request_data['language'] or 'en'
		
		ttsEngine = gTTS(text=text, lang=language, slow=False)
		ttsEngine.save()filename

		return send_file(filename, mimetype='audio/mp3')
	elif request.method == 'GET':  
		return redirect('/')

app.run(host='0.0.0.0', port=8080)
