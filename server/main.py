from fastapi import FastAPI
import uvicorn
import base64
import replicate
from fastapi.middleware.cors import CORSMiddleware

import cv2
import numpy as np
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5001",
    ""
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/pix")
async def root(body: dict):
    model = replicate.models.get("timothybrooks/instruct-pix2pix")
    version = model.versions.get(
        "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f"
    )

    with open("image.jpg", "wb") as f:
        f.write(base64.b64decode(body["image"]))

    mask = body["mask"]
    print(body)
    if mask:
        img = cv2.imread("image.jpg")
        height, width = img.shape[:2]

        img = np.zeros((int(height), int(width), 3), np.uint8)
        # print(type(mask["x"])#
        x = int(mask["x"])
        y = int(mask["y"])
        width = int(mask["width"])
        height = int(mask["height"])

        cv2.rectangle(img, (x, y),
                      (x + width, y + height), (255, 255, 255), -1)
        cv2.imwrite("mask.jpg", img)

        model = replicate.models.get(
            "stability-ai/stable-diffusion-inpainting")
        version = model.versions.get(
            "c28b92a7ecd66eee4aefcd8a94eb9e7f6c3805d5f06038165407fb5cb355ba67")

        inputs = {
            'prompt': body["prompt"],
            'image': open("image.jpg", "rb"),

            'mask': open("mask.jpg", "rb"),
            'num_inference_steps': body["num_inference_steps"],
            'guidance_scale': 15,
        }
        output = version.predict(**inputs)
        return {"output": output[0]}

    inputs = {
        'image': open("image.jpg", "rb"),
        'prompt': body["prompt"],
        'num_outputs': 1,
        'num_inference_steps': body["num_inference_steps"],
        'guidance_scale': 7.5,
        'image_guidance_scale': 1.5,
        'scheduler': "K_EULER_ANCESTRAL",
    }
    output = version.predict(**inputs)
    return {"output": output[0]}


uvicorn.run(app, host="0.0.0.0", port=5001)


# img = np.zeros((512, 512, 3), np.uint8)

# Draw a white rectangle
# cv2.rectangle(img, (100, 100), (300, 300), (255, 255, 255), -1)
# cv2.imwrite("mask.jpg", img)
