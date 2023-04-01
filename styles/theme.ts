const size = {
  mobile: "768px",
  tablet: "1100px",
  desktop: "2560px",
};

export const theme = {
  grey: "rgba(242,241,251,255)",
  lightGrey: "rgba(249,248,252,255)",
  main: "rgba(93,107,237,255)",
  lightMain: "rgba(93,107,237,0.8)",
  fontColor: "rgba(31,47,86,255)",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px",
  red: "rgb(250, 128, 114)",
  redChart: { color: "rgba(255, 99, 132, 0.2)", border: "rgb(255, 99, 132)" },
  yellowChart: {
    color: "rgba(255, 205, 86, 0.2)",
    border: "rgb(255, 205, 86)",
  },
  greenChart: { color: "rgba(75, 192, 192, 0.2)", border: "rgb(75, 192, 192)" },
  orangeChart: {
    color: "rgba(255, 159, 64, 0.2)",
    border: "rgb(255, 159, 64)",
  },

  device: {
    mobile: `(max-width: ${size.mobile})`,
    tablet: `(max-width: ${size.tablet})`,
    desktop: `(max-width: ${size.desktop})`,
  },
};
