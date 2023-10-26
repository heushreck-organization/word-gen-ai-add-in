import * as React from "react";
import Header from "./Header";
import Body from "./Body";
import { makeStyles } from "@fluentui/react-components";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App = (props: AppProps) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Header logo="assets/bmw_long.png" title={props.title} message="GEN AI Assistant" />
      <Body />
    </div>
  );
};

export default App;
