const facebookInit = () => {
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1683234035672865",
        cookie: true,
        xfbml: true,
        version: "v23.0",
      });
    };
  };

export default facebookInit;
