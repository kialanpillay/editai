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
} from "reactstrap";
import { TiTick } from "react-icons/ti";
import { GrClose } from "react-icons/gr";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const SERVER_URL = "http://localhost:5000";

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
  });
  const [current, setCurrent] = useState({
    prompt: "",
    imageURL: "",
    imageBlob: null,
    status: "succeeded",
    mask: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

    setCurrent((prev) => {
      return {
        ...prev,
        status: "pending",
      };
    });

    // Low fidelity request
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
        };
      });
    });
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setPrevious((prevState) => ({
        ...prevState,
        imageBlob: i,
        ["imageURL"]: URL.createObjectURL(i),
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
    }); // Clear current
  };

  const handleReject = () => {
    setCurrent({
      prompt: "",
      imageURL: "",
      status: "succeeded",
    }); // Clear current
  };

  const handleHistory = (i) => {
    setCurrent((prevState) => ({
      ...prevState,
      ["imageURL"]: history[i]["imageURL"],
    }));
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
              Clear mask
            </Button>
          </Col>
        </Row>
        <Row className={"my-4"}>
          <Col lg={5} md={5}>
            {/** Previous (or Original) Image */}
            <Card body>
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
          <Col lg={5} md={5}>
            {/** Current Image */}
            <Card body>
              {current["status"] === "pending" ? (
                <Row className="justify-content-center">
                  <Spinner
                    color="primary"
                    style={{
                      height: "3rem",
                      width: "3rem",
                    }}
                  >
                    Loading...
                  </Spinner>
                </Row>
              ) : current["imageURL"] !== "" ? (
                <img alt="Input" src={current.imageURL} />
              ) : null}
            </Card>
          </Col>
          <Col lg={2} md={2}>
            <Row>
              <Col lg={3}>
                <Button color="primary" onClick={handleAccept}>
                  <TiTick />
                </Button>
              </Col>
              <Col lg={3}>
                <Button color="light" onClick={handleReject}>
                  <GrClose color="white" />
                </Button>
              </Col>
            </Row>
            <h3 className={"mt-2"}>Edit History</h3>
            {/* {history.map((h, i) => {
            <Row>
              <Col lg={3}>
                <Button color="primary" onClick={handleAccept}>
                  <TiTick />
                </Button>
              </Col>
              <Col lg={3}>
                <Button color="light" onClick={handleReject}>
                  <GrClose color="white" />
                </Button>
              </Col>
            </Row>
            <h3 className={"mt-2"}>Edit History</h3>
            {/* {history.map((h, i) => {
                  return <a onClick={(i) => handleHistory(i)} key={i}>{h}</a>
              })} */}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Editor;
