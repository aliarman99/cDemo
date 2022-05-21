import React, { useEffect } from "react";
import Routes from "./routes/Index";
import { Grommet } from "grommet";
import AuthAction from "./store/Actions/AuthAction";

const App = () => {
  useEffect(() => {
    AuthAction.isAuthenticated();
  }, []);
  return (
    <Grommet theme={theme} plain>
      <Routes />
    </Grommet>
  );
};
const theme = {
  global: {
    font: {
      family: "sans-serif",
      size: "14px",
      height: "20px",
    },
  },
};

export default App;
