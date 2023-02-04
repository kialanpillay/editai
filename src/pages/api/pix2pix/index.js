export default async function handler(req, res) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/stable-diffussion/versions
      version:
        "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",

      // This is the text prompt that will be submitted by a form on the frontend
      input: {
        image:  req.body.image,
        prompt: req.body.prompt,
        num_inference_steps: req.body.num_inference_steps,
  
        num_outputs: 1,
        image_guidance_scale: 2,
        guidance_scale: 7.5,
        scheduler: "K_EULER_ANCESTRAL",
      },
    }),
  });

  console.log(req)
  console.log(response)
  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}