import { Spinner } from "@shopify/polaris";

const IntroPreloader = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Spinner size="large" />
    </div>
  );
};

export default IntroPreloader;
