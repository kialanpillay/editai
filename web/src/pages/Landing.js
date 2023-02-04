import React, { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
const { default: Terra } = require("terra-api");

const Landing = () => {
  const terra = new Terra(
    "ichackflatline-dev-lB5aohCxQY",
    "0c9e099cf990db13decf253d451729010a8ce521082421b660fe194d7d96e0d7"
  );

  useEffect(() => {
    terra
      .generateWidgetSession({
        referenceID: "1",
        providers: ["Apple"],
        showDisconnect: true,
        language: "EN",
        authSuccessRedirectUrl: "success.com",
        authFailureRedirectUrl: "failure.com",
      })
      .then((s) => {
        // use the various response elements
        if (s.status === "success") console.log(s.url);
        else console.log(s.status);
      });
  });

  return (
    <Container className={"page"}>
      <div>
        <h1>Connect Device</h1>
        <Button>Connect</Button>
      </div>
    </Container>
  );
};

export default Landing;
