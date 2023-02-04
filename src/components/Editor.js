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

const SERVER_URL = "http://localhost:5000";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const Editor = () => {
  const [history, setHistory] = useState([]);
  const [previous, setPrevious] = useState({
    prompt: "",
    imageURL: "https://picsum.photos/id/27/800/600",
    imageBlob: null,
    status: "",
  });
  const [current, setCurrent] = useState({
    prompt: "",
    imageURL: "",
    imageBlob: null,
    status: "succeeded",
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
    const reqBody = JSON.stringify({
      prompt: prompt,
      num_inference_steps: 10,
      image: previous.imageBlob,
    });
    console.log(`handle Edit req body ${reqBody}`);

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

      setCurrent((prev) => {
        return {
          ...prev,
          status: "low_fidelity",
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
          <Col lg={5} md={12}>
            <FormGroup>
              <Input name="file" onChange={uploadToClient} type="file" />
            </FormGroup>
          </Col>
          <Col lg={5} md={12}>
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
        </Row>
        <Row className={"my-4"}>
          <Col lg={5} md={5}>
            {/** Previous (or Original) Image */}
            <Card body>
              <img alt="Input" src={previous["imageURL"]} />
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
                  return <a onClick={(i) => handleHistory(i)} key={i}>{h}</a>
              })} */}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Editor;
