from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/", methods=["POST"])
def posetrackerdata():
    data = request.json
    print("data recived:" , data)
    return jsonify({'feedback': 'correct posture!'}), 200


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)