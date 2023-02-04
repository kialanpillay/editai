import React, {useState} from 'react';
import {Container, Row, Col, Input, InputGroup, Button, Card, FormGroup, Spinner} from "reactstrap";
import { TiTick } from 'react-icons/ti';
import { GrClose } from 'react-icons/gr';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Editor = () => {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState({
    prompt: "",
    imageURL: "https://picsum.photos/800/600",
    imageBlob: null,
    status: ""
  });

  const handleChange = (event) => {
    const {name, value} = event.target
    setCurrent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = async (event) => {
    const prompt = current["prompt"]
    
    // Low fidelity request
    const low_fidelity_response = fetch("/api/pix2pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        num_inference_steps: 10,
        image: current.imageBlob ?? current.imageURL
      })
    }).then(async (resp) => {
      const resp_json = await resp.json()
      console.log(resp_json)
      let prediction = await fetch(`/api/pix2pix/${resp_json.id}`)
      prediction = prediction.json()

      setCurrent((prev) => {
        return {
          ...prev,
          "status": "pending",
        }
      })
      // Status is either succeeded, processing, or started
      while (prediction.status != "succeeded") {
        await sleep(1000)
        prediction = await fetch(`/api/pix2pix/${resp_json.id}`)
        prediction = await prediction.json()
      }
      console.log(`succeeded for id ${resp_json.id}`)
      setCurrent((prev) => {
        return {
          ...prev,
          "status": "low_fidelity",
          "imageURL": prediction.output_image,
          "imageBlob": null,
        }
      })
    })
  };


  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setCurrent((prevState) => ({
        ...prevState,
        ["imageBlob"]: i,
        ["imageURL"]: URL.createObjectURL(i)
      }));
    }
  };

  
  const handleAccept = () => {
    setHistory([
      ...history,
      current
    ])
  }

  const handleReject = () => {   
    // Display last image
  }

  const handleHistory = (i) => {
    setCurrent((prevState) => ({
      ...prevState,
      ["imageURL"]: history[i]["imageURL"]
    }));
  }

  return (
    <section className="section">
      <Container id={"editor"}>
        <Row className=" pt-5">
          <Col lg={5} md={12}>
            <FormGroup >
              <Input
                  name="file"
                  onChange={uploadToClient}
                  type="file"
              />
            </FormGroup>
          </Col>
          <Col lg={5} md={12}>
            <InputGroup>
              <Input
                  name="prompt"
                  value={current["prompt"]}
                  placeholder="Change the background color to red."
                  onChange={handleChange}
                  type="text"/>
              <Button onClick={handleEdit}>
                Edit
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row className={"my-4"}>
          <Col lg={5} md={5}>
            <Card body>
              <img
                  alt="Input"
                  src={current["imageURL"]}
              />
            </Card>
          </Col>
          <Col lg={5} md={5}>
            <Card body>
              {current["status"] === "pending" ? 
              <Row className="justify-content-center">
                 <Spinner
                  color="primary"
                  style={{
                    height: '3rem',
                    width: '3rem'
                  }}
                >
                  Loading...
                </Spinner>
              </Row> :  <img
                  alt="Input"
                  src={current.imageURL}
              />}
            </Card>
          </Col>
          <Col lg={2} md={2}>
          <Row>
          <Col lg={3}>
            <Button color="primary" onClick={handleAccept}>
              <TiTick/>
            </Button>
          </Col>
          <Col lg={3}>
            <Button color="light" onClick={handleReject}>
            <GrClose color='white'/>
            </Button>
          </Col>
        </Row>
            <h3 className={"mt-2"}>
              Edit History
            </h3>
              {history.map((h, i) => {
                  return <a onClick={(i) => handleHistory(i)} key={i}>{h}</a>
              })}

          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Editor;