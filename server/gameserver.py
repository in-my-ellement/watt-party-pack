from flask import Flask, render_template
app = Flask(__name__)

# headers
@app.after_request
def headers(response):
    # add response headers to all responses
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin" 
    response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"

    return response

@app.route("/")
def index():
    # put the html in the ./templates folder
    return render_template("game.html")
