import React from 'react';
import {Container, Row, Col, FormGroup, Label, Input} from 'reactstrap';

const Hero = () => {
  return (
    <section className="section position-relative">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="pr-lg-5 my-5">
              <h1 className="mb-4 font-weight-bolder line-height-1_4 display-2" >Edit<span className="text-primary font-weight-medium">AI</span></h1>
              <p className="text-muted mb-4 pb-2 display-6">Forget Photoshop. <br/> Edit any image using just words.</p>
              <a href="#editor" className="btn btn-primary my-4 btn-large">
                Get Started <span className="ml-2 right-icon">&#8594;</span>
              </a>
            </div>
          </Col>
          <Col lg={6}>
            <div className="mt-5 mt-lg-0">
              <img src="hero.jpg" alt="" className="img-fluid mx-auto d-block"/>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;