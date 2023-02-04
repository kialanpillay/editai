import requests
import logging
import uuid
import os
from datetime import datetime
from flask import Flask, request, jsonify, make_response
from flask_restx import Resource, fields, Namespace
import replicate

model = replicate.models.get("timothybrooks/instruct-pix2pix")
version = model.versions.get(
    "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f")

api = Namespace('pix')

logging.basicConfig(format='%(asctime)s - [%(levelname)s] %(message)s',
                    datefmt='%d-%b-%y %H:%M:%S',
                    level=logging.INFO)


@api.header("Access-Control-Allow-Origin", "*")
class Pix(Resource):
    @api.response(200, 'Success', headers={"Access-Control-Allow-Origin": "*",
                                           "Access-Control-Allow-Headers": "*",
                                           "Access-Control-Allow-Methods": "GET, PUT, OPTIONS"})
    def options(self, req):
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add(
            "Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
        return response

    # @api.expect(config_resource)
    @api.response(200, "Success")
    @api.response(500, "Server Error")
    @api.response(502, "Bad Gateway")
    def post(self, req):
        try:
            payload = req.get_json()
            inputs = {
                # An image which will be repainted according to prompt
                # 'image': open("./ic hack logo.jpg", "rb"),
                'image': open("./ic hack logo.jpg", "rb"),
                'prompt': "make background red",
                'num_outputs': 1,
                'num_inference_steps': 100,
                'guidance_scale': 7.5,
                'image_guidance_scale': 1.5,
                'scheduler': "K_EULER_ANCESTRAL",
            }

            output = version.predict(**inputs)

            # make request to replicate
            response.headers.add("Access-Control-Allow-Origin", "*")
            # add output to response
            response.headers.add("Access-Control-Allow-Headers", "*")
            response.body = {"output": output[0]}

            return response
        except Exception as error:
            return jsonify({"code": 500, "status": "Server Error", "error": str(error)})

    # @api.expect(email_resource)
