import React, {useState} from 'react';
import {Container, Row, Col, Input, InputGroup, Button, CardTitle, CardText, Card} from "reactstrap";

const Editor = () => {
  const [history, setHistory] = useState(["Change the background color."]);
  const [prompt, setPrompt] = useState("")

  const handleChange = (event) => {
    setPrompt(event.target.value)
  };

  const handleSubmit = (event) => {
    // Call API
  };

  return (
    <section className="section" id="service">
      <Container>
        <Row className="justify-content-center">
        </Row>
        <Row>
          <Col lg={10} md={12}>
            <InputGroup>
              <Input
                  name="prompt"
                  value={prompt}
                  placeholder="Change the background color to red."
                  onChange={handleChange}
                  type="text"/>
              <Button onClick={handleSubmit}>
                Edit
              </Button>
            </InputGroup>
          </Col>
          <Col lg={2} md={12}> </Col>
        </Row>
        <Row className={"my-4"}>
          <Col lg={6} md={6}>
            <Card body>
              <img
                  alt="Card"
                  src="https://picsum.photos/300/200"
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