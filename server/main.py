from fastapi import FastAPI
import uvicorn
import replicate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = replicate.models.get("timothybrooks/instruct-pix2pix")
version = model.versions.get(
    "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f")


@app.post("/pix")
async def root(body: dict):
    print(body)
    inputs = {
        'image': body["image"],
        'prompt': body["prompt"],
        'num_outputs': 1,
        'num_inference_steps': body.get("num_inference_steps", 10),
        'guidance_scale': 7.5,
        'image_guidance_scale': 1.5,
        'scheduler': "K_EULER_ANCESTRAL",
    }
    output = version.predict(**inputs)
    return {"output": output[0]}


uvicorn.run(app, host="0.0.0.0", port=5000)

# # https://replicate.com/timothybrooks/instruct-pix2pix/versions/30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f#input

# # https://replicate.com/timothybrooks/instruct-pix2pix/versions/30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f#output-schema
# output = version.predict(**inputs)
# print(output)
# inputs["image"] = output[0]
# output = version.predict(**inputs)
# print(output)
