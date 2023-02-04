import React, {useState} from 'react';
import {Container, Row, Col, Input, InputGroup, Button, Card, FormGroup} from "reactstrap";

const Editor = () => {
  const [history, setHistory] = useState([]);
  const [formState, setFormState] = useState({});
  const [images, setImages] = useState([]);
  const [imageURL, setImageURL] = useState(null);

  const handleChange = (event) => {
    const {name, value} = event.target
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    // Call API

    // Low fidelity request
    const low_fidelity_response = fetch("/api/pix2pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: formState["prompt"],
        num_inference_steps: 10
      })
    }).then()

    // High fidelity request
    const high_fidelity_response = fetch("/api/pix2pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: formState["prompt"],
        num_inference_steps: 100
      })
    }).then()    

    // Update history
  };

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setFormState((prevState) => ({
        ...prevState,
        ["file"]: i,
      }));
      setImageURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append("file", image);
    const response = await fetch("/api/file", {
      method: "POST",
      body
    });
  };

  return (
    <section className="section" id="service">
      <Container id={"editor"}>
        <Row className=" pt-5">
          <Col lg={6} md={12}>
            <FormGroup >
              <Input
                  name="file"
                  onChange={uploadToClient}
                  type="file"
              />
            </FormGroup>
          </Col>
          <Col lg={6} md={12}>
            <InputGroup>
              <Input
                  name="prompt"
                  value={formState["prompt"]}
                  placeholder="Change the background color to red."
                  onChange={handleChange}
                  type="text"/>
              <Button onClick={handleSubmit}>
                Edit
              </Button>
            </InputGroup>
          </Col>


        </Row>
        <Row className={"my-4"}>
          <Col lg={6} md={6}>
            <Card body>
              <img
                  alt="Input"
                  src={imageURL}
              />
            </Card>
          </Col>
          <Col lg={6} md={6}>
            <h3>
              Edit History
            </h3>
              {history.map((h, i) => {
                  return <a href={"#"} onClick={null} key={i}>{h}</a>
              })}

          </Col>
        </Row>
        <Row className={"mt-3"}>
          <Col lg={'auto'} className={"mr-1"}>
            <Button color="primary" size={"lg"}>
              Confirm
            </Button>
          </Col>
          <Col lg={'auto'} >
            <Button color="secondary" size={"lg"}>
              Retry
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Editor;