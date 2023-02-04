import React, {useState} from 'react';
import {Container, Row, Col, Input, InputGroup, Button, CardTitle, CardText, Card} from "reactstrap";

const Editor = () => {
  const [history, setHistory] = useState([]);
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

              <CardTitle tag="h5">
                Special Title Treatment
              </CardTitle>
              <img
                  alt="Card"
                  src="https://picsum.photos/300/200"
              />
              <Row>
                <Col lg={'auto'}>
                  <Button>
                    Go somewhere
                  </Button>
                </Col>
                <Col lg={'auto'}>
                  <Button>
                    Go somewhere
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Editor;