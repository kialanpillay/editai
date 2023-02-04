from flask import Flask
from app.apis import pix

app = Flask(__name__)
pix.init_app(app)
