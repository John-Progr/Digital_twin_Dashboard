import React, { useEffect, useRef } from 'react';

const GrafanaWidget = ({ panelUrl, title, width = "100%", height = "300px" }) => {
  const iframeRef = useRef(null);

  // Function to refresh the iframe
  const refreshIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = `${panelUrl}&_=${new Date().getTime()}`;  // Append timestamp to force reload
    }
  };

  // UseEffect to set up the auto-refresh
  useEffect(() => {
    const interval = setInterval(refreshIframe, 15000); // Refresh every 15 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [panelUrl]);

  return (
    <div className="grafana-widget">
      <h3>{title}</h3>
      <iframe
        ref={iframeRef}
        src={panelUrl}
        width={width}
        height={height}
        frameBorder="0"
        title={title}
        allowFullScreen
      />
    </div>
  );
};

export default GrafanaWidget;