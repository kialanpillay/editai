import React, { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { Connections, initConnection, initTerra } from "terra-react";

const Landing = () => {
  useEffect(() => {
    const init = async () => {
      await initTerra("ichackflatline-dev-lB5aohCxQY", "1");
      await initConnection(
        Connections.APPLE_HEALTH,
        "0c9e099cf990db13decf253d451729010a8ce521082421b660fe194d7d96e0d7",
        true
      );
    };

    void init();
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
