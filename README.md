# EditAI

## What is EditAI?
EditAI is a lightweight web application that pushes the boundaries of image-editing software. Our users can rapidly edit images using sequences of simple text prompts. This means no Photoshop and no Canva.

## What's new?
Despite the power of text-to-image diffusion-based deep learning models (e.g. DALL-E), the long inference time, lack of a user-friendly interface and instability make them difficult to use in practice. Inspired by this need, EditAI delivers a unique user experience through edits that improve over time. Low-fidelity images are generated and previewed to users near-instantly, whilst higher-fidelity versions are generated in the background, with the high-resolution output available for export at the end. A user can map out their edits within a fraction of the time taken using comparable tools.

## Why is it useful?*
EditAI can be used in a wide range of cases, from applying last-minute poster changes or quickly applying the perfect tweaks to photos. It removes the necessity of complex software tools for simple edits, reducing end-to-end editing time. The web interface is extremely intuitive and no software setup is required so it can be used by users of all technical capabilities (think - your grandparents!). Finally, it allows images to be edited on mobile devices on-the-go since editing doesn't require any fine motor movements.

## How is it implemented?
EditAI is built using Next.js, with server-side rendering for fluid interactions. A multi-queue architecture is applied to parallelise image data processing. A Python server using FastAPI processes dispatched requests and communicates with the inference API endpoints. EditAI’s functionality is powered by multiple fine-tuned models. Diffusion-based models support both novel image synthesis and the alteration of existing image segments. The pre-trained models are frozen and cloud-hosted behind APIs, supporting high-accuracy, low-latency inference. Compared to other solutions, EditAI improves energy efficiency by utilising containerised models - compute instances are demand-scaled.

## What challenges did we face?
When creating parallel processing queues to deliver the intended user experience, we had to consider race conditions between low and high-fidelity predictions. Another technical challenge was rewriting the entire backend in Python as we realised that Next.js serverless functions could not support blob parsing that was essential for our multi-step image generation. Of course, lack of sleep is always a technical challenge at ICHack! :P

## Where do we want to take this in the future?
We would love to expand the functionality of EditAI to support more complex edits such as text modifications (e.g. font, colour, scale) and a wider range of export formats. Another useful feature would be bulk image editing. Finally, we intend to open-source the software, and in the long-term it would be great to build our own stable diffusion models
