from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import response
app = Flask(__name__)
cors=CORS(app)
app.config['CORS_HEADERS']='Content-Type'

@app.route('/api/predict', methods=['POST'])
def predict():
 data = request.get_json()  # Get the JSON data from the request
 message = data['message']  # Extract the message from the JSON data
 chatId=data['chatId']
    # response = {
    #     data:"Got the response"
    # }
 result=response(message, chatId, show_details=False)
 dict={'prediction': result} 
 return jsonify(dict)
#  return result

# jsonify(response)  # Return the response as JSON

if __name__ == '__main__':
    app.run(debug=True)
