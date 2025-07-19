from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
app = Flask(__name__)
cred = credentials.Certificate("serviceAccountKey.json") 
firebase_admin.initialize_app(cred)
db = firestore.client()
notices_ref = db.collection("notices")
@app.route("/notices", methods=["GET"])
def get_notices():
    notices = [doc.to_dict() for doc in notices_ref.stream()]
    return jsonify(notices), 200
@app.route("/notices", methods=["POST"])
def add_notice():
    data = request.json
    doc_ref = notices_ref.document()
    doc_ref.set(data)
    return jsonify({"message": "Notice added successfully"}), 201
@app.route("/notices/<notice_id>", methods=["DELETE"])
def delete_notice(notice_id):
    notices_ref.document(notice_id).delete()
    return jsonify({"message": "Notice deleted successfully"}), 200
if __name__ == "__main__":
    app.run(debug=True)
