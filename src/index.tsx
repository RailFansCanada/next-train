import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createGlobalStyle } from "styled-components";
import LeagueSpartan from "./fonts/LeagueSpartan-Bold.otf";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'LeagueSpartan';
    src: url(${LeagueSpartan});
  }
  body {
    margin: 0;
    font-family: 'LeagueSpartan', sans-serif;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
