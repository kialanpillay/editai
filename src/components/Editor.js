import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  Button,
  Card,
  FormGroup,
  Spinner,
  Badge,
} from "reactstrap";
import { TiTick } from "react-icons/ti";
import { GrClose, GrDownload } from "react-icons/gr";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { saveAs } from "file-saver";

const SERVER_URL = "http://localhost:5001";
const HIGH_INFERENCE_STEPS = 100;

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

async function createFile(url) {
  let response = await fetch(url);
  let data = await response.blob();
  let metadata = {
    type: "image/png",
  };
  return new File([data], "temp.png", metadata);
}

const Editor = () => {
  const [history, setHistory] = useState([]);
  const [previous, setPrevious] = useState({
    prompt: "",
    imageURL: "",
    imageBlob: null,
    status: "",
    mask: null,
    seq: 0,
  });
  const [current, setCurrent] = useState({
    prompt: "",
    imageURL: "",
    imageBlob: null,
    status: "succeeded",
    mask: null,
    seq: 0,
  });

  const [highResImage, setHighResImage] = useState({
    imageURL: "",
    imageBlob: null,
    status: "pending",
    seq: 0,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDownload = () => {
    saveAs(highResImage["imageURL"]);
  };

  const handleEdit = async (event) => {
    const prompt = current["prompt"];
    console.log(previous.imageBlob);

    // then use JSON.stringify on new object
    let imageBlobStr = await blobToBase64(previous.imageBlob);

    const getBase64StringFromDataURL = (dataURL) =>
      dataURL.replace("data:", "").replace(/^.+,/, "");

    const reqBody = JSON.stringify({
      prompt: prompt,
      num_inference_steps: 10,
      image: getBase64StringFromDataURL(imageBlobStr),
      mask: previous.mask,
    });

    const highResReqBody = JSON.stringify({
      prompt: prompt,
      num_inference_steps: HIGH_INFERENCE_STEPS,
      image: getBase64StringFromDataURL(imageBlobStr),
      mask: previous.mask,
    });

    setCurrent((prev) => {
      return {
        ...prev,
        prompt: prompt,
        status: "pending",
      };
    });

    setHighResImage((prev) => {
      return {
        ...prev,
        status: "pending",
      };
    });

    // Low-Res
    await fetch(`${SERVER_URL}/pix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: reqBody,
    }).then(async (resp) => {
      const prediction = await resp.json();
      console.log(prediction);

      const blob = await createFile(prediction.output);
      setCurrent((prev) => {
        return {
          ...prev,
          status: "low_fidelity",
          imageBlob: blob,
          imageURL: prediction.output,
          seq: prev.seq + 1,
        };
      });
    });

    // High-Res
    await fetch(`${SERVER_URL}/pix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: highResReqBody,
    }).then(async (resp) => {
      const prediction = await resp.json();
      const blob = await createFile(prediction.output);
      setHighResImage((prev) => {
        return {
          seq: prev.seq + 1,
          imageBlob: blob,
          imageURL: prediction.output,
          status: "succeeded",
        };
      });

      console.log(prediction);

      if (highResImage["seq"] === current["seq"]) {
        setCurrent((prev) => {
          return {
            ...prev,
            imageBlob: blob,
            imageURL: prediction.output,
            status: "high_fidelity",
          };
        });
      }
    });
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setHistory([]);
      setPrevious((prevState) => ({
        ...prevState,
        imageBlob: i,
        imageURL: URL.createObjectURL(i),
      }));
    }
  };

  const handleAccept = () => {
    setPrevious(current);
    setHistory([...history, current]);
    setCurrent({
      prompt: "",
      imageURL: "",
      status: "succeeded",
      imageBlob: null,
    }); // Clear current
  };

  const handleReject = () => {
    setCurrent({
      prompt: "",
      imageURL: "",
      status: "succeeded",
      imageBlob: null,
    }); // Clear current
  };

  const handleHistory = (i) => {
    setPrevious(history[i]);
    setCurrent({
      prompt: "",
      imageURL: "",
      status: "succeeded",
    }); // Clear current
  };

  return (
    <section className="section">
      <Container id={"editor"}>
        <Row className=" pt-5">
          <Col lg={5} md={5}>
            <FormGroup>
              <Input name="file" onChange={uploadToClient} type="file" />
            </FormGroup>
          </Col>
          <Col lg={5} md={5}>
            <InputGroup>
              <Input
                name="prompt"
                value={current["prompt"]}
                placeholder="Change the background color to red."
                onChange={handleChange}
                type="text"
              />
              <Button onClick={handleEdit}>Edit</Button>
            </InputGroup>
          </Col>
          <Col>
            <Button
              onClick={() =>
                setPrevious({
                  ...previous,
                  mask: null,
                })
              }
            >
              Clear Mask
            </Button>
          </Col>
        </Row>
        <Row className={"my-4"}>
          <Col lg={5} md={5} sm={12} className={"mb-3"}>
            {/** Previous (or Original) Image */}
            <p className="display-5">Original</p>
            <Card body style={{ minHeight: "25rem" }}>
              {previous["imageURL"] !== "" ? (
                <ReactCrop
                  crop={previous.mask}
                  onChange={(c) =>
                    setPrevious({
                      ...previous,
                      mask: c,
                    })
                  }
                >
                  <img alt="Input" src={previous.imageURL} />
                </ReactCrop>
              ) : null}
            </Card>
          </Col>
          <Col lg={5} md={5} sm={12} className={"mb-3"}>
            {/** Current Image */}
            <Row>
              <Col sm="auto">
                  <p className="display-5 mr-2">Edited</p>
              </Col>
              <Col>
                {current["status"] === "pending" ? (
                  <Spinner
                    color="primary"
                    type="grow"
                    style={{
                      height: "3rem",
                      width: "3rem",
                    }}
                  >
                    Loading...
                  </Spinner>
                ) :
                current["status"] === "high_fidelity" ? (
                  <h4>
                    <Badge color="success" className="mt-3">High</Badge>
                  </h4>
                ) : null}
              </Col>
            </Row>

            <Card body style={{ minHeight: "25rem" }}>
              {current["status"] === "pending" ? null : current["imageURL"] !==
                "" ? (
                <img alt="Input" src={current.imageURL} />
              ) : null}
            </Card>
          </Col>
          <Col lg={2} md={2} sm={12}>
            <Row>
              <Col lg={3} sm={12} className="mb-3">
                <Button color="primary" onClick={handleAccept}>
                  <TiTick />
                </Button>
              </Col>
              <Col lg={3} sm={12} className="mb-3">
                <Button color="light" onClick={handleReject}>
                  <GrClose color="white" />
                </Button>
              </Col>
              <Col lg={3} sm={12} className="mb-3">
                <Button
                  color="light"
                  disabled={highResImage["status"] !== "succeeded"}
                  onClick={handleDownload}
                >
                  <GrDownload />
                </Button>
              </Col>
            </Row>
            <h3 className={"mt-2 fw-light"}>Edit History</h3>
            
              {history.map((h, i) => {
                return (
                  <Button
                    color="light"
                    onClick={(_) => handleHistory(i)}
                    key={i}
                    className="mb-1"
                  >
                    {`(${i+1}) ${h.prompt}`}
                  </Button>
                );
              })}
            
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Editor;
