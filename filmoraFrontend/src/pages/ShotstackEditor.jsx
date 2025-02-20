import { useEffect } from "react";

const ShotstackEditor = () => {
  useEffect(() => {
    // Load Shotstack SDK
    const script = document.createElement("script");
    script.src = "https://js.shotstack.io/studio/0.5.6/shotstack.min.js";
    script.async = true;
    script.onload = () => {
      if (window.shotstack) {
        // Initialize Shotstack Studio
        window.shotstack.create("studio", "template", {
          owner: "dfg53hkjl4",
          interactive: true,
          timeline: true,
          sidebar: true,
          settings: true,
          controls: true,
          style: {
            logo: {
              url: "https://shotstack-assets.s3.amazonaws.com/icons/unicorn.svg",
            },
            stylesheet:
              "https://shotstack-studio-sdk.s3.amazonaws.com/styles/sdk-custom.css",
          },
        });

        // Apply Refresh Configurations After Initialization
        setTimeout(() => {
          window.shotstack.refresh("studio", { interactive: false });
          window.shotstack.refresh("studio", { timeline: true });
          window.shotstack.refresh("studio", { sidepanel: true });
          window.shotstack.refresh("studio", { settings: false });
          window.shotstack.refresh("studio", { controls: true });
          window.shotstack.refresh("studio", {
            style: {
              stylesheet:
                "https://shotstack-studio-sdk.s3.amazonaws.com/styles/sdk-custom.css",
              logo: {
                url: "https://www.reshot.com/preview-assets/icons/XDCHJTKVNP/unicorn-XDCHJTKVNP.svg",
              },
            },
          });
        }, 1000); // Delay to ensure the editor is fully initialized
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="studio" style={{ width: "100%", height: "500px" }}></div>;
};

export default ShotstackEditor;
