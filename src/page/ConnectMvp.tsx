import { WebMap, WebScene } from "@esri/react-arcgis";
import { loadCss, loadModules, setDefaultOptions } from "esri-loader";

// before loading the modules for the first time,
// also lazy load the CSS for the version of
// the script that you're loading from the CDN
const options = {
  css: true,
  // insert the stylesheet link above the first <style> tag on the page
  insertCssBefore: "style",
};

loadModules(["esri/views/MapView", "esri/WebMap"], options);

// by default loadCss() loads styles for the latest 4.x version
loadCss();

// or for a specific CDN version
loadCss("4.25");

// or a from specific URL, like a locally hosted version
loadCss("http://server/version/esri/themes/light/main.css");

function ConnectMvp() {
  return (
    <div>
      <p>ConnectMvp Page</p>
      <div style={{ width: "100vw", height: "100vh" }}>
        <WebMap id="6627e1dd5f594160ac60f9dfc411673f" />
        <WebScene id="f8aa0c25485a40a1ada1e4b600522681" />
      </div>
      , document.getElementById('container')
    </div>
  );
}

export default ConnectMvp;
