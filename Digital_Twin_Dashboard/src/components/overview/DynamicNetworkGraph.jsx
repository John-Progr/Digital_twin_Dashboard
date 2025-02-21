import React, { useState, useEffect } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { getDigitalTwinState } from '../../services/eclipse-ditto'; // Import your Ditto SSE handler


//STEP 1: State Management
const DynamicNetworkGraph = () => {
  const [networkData, setNetworkData] = useState({
    things: [],
    connections: [],
  }); // We use useState to manage networkData 

  const containerRef = React.useRef(null);


  //STEP 2: Data Initialization
  // Use effect to start listening to Ditto SSE
  /*When the DynamicNetworkGraph component calls getDigitalTwinState():

It establishes a connection to the Ditto API.
It starts receiving and handling real-time events from Ditto.
When the component unmounts, the useEffect cleanup function invokes closeConnection to terminate the connection. */
  useEffect(() => {
    // Start the connection to Ditto
    const { closeConnection } = getDigitalTwinState(handleNewThingData);

    // Cleanup on component unmount,The conncetion is closed when the component unmounts
    return () => {
      closeConnection();
    };
  }, []);


  //STEP 3: Updating the Graph
  // Function to update network data based on SSE events
  const handleNewThingData = (newThingData) => {
    const newThing = {
        id: newThingData.thingId, // Use thingId as id
        ip: newThingData.features.network.properties.device_ip, // Map device_ip to ip
        hl_nt: newThingData.features.network.properties.hl_int,
        tc_nt: newThingData.features.network.properties.tc_int,
        error: newThingData.features.network.properties.error,
        neighbors: newThingData.features.network.properties.neighbors.map((neighbor) => ({
          id: neighbor.ipv4Address, // Use ipv4Address as neighbor id
        })),
      };
     console.log(newThing)
    setNetworkData((prevData) => {
      // Check if the thing already exists, otherwise add it
      const existingThingIndex = prevData.things.findIndex((thing) => thing.id === newThing.id);

      // If the thing exists, update its neighbors, else add the new thing
      const updatedThings = [...prevData.things];
      if (existingThingIndex === -1) {
        updatedThings.push(newThing);
      } else {
        updatedThings[existingThingIndex] = newThing;
      }

      // Update the connections based on neighbors
      const updatedConnections = generateConnections(updatedThings);
      console.log("THE UPDATED CONNECTIONS")
      console.log(updatedConnections)
      // Remove connections that are no longer present
    // Remove connections that are no longer present
    const validConnections = updatedConnections.filter((connection) => {
      const fromThing = updatedThings.find((thing) => thing.ip === connection.from);
      const toThing = updatedThings.find((thing) => thing.ip === connection.to);

      // Ensure both nodes exist and the connection is still valid
      return (
        fromThing &&
        toThing &&
        fromThing.neighbors.some((neighbor) => neighbor.id === toThing.ip) &&
        toThing.neighbors.some((neighbor) => neighbor.id === fromThing.ip)
      );
    });

    console.log(validConnections)
      return {
        things: updatedThings,
        connections: validConnections,
      };
    });
  };
  const generateConnections = (things) => {
    const connections = [];
    const addedConnections = new Set(); // Track existing connections
  
    things.forEach((thing) => {
      thing.neighbors.forEach((neighbor) => {
        const connectionKey = `${thing.ip}-${neighbor.id}`;
        const reverseKey = `${neighbor.id}-${thing.ip}`;
  
        // Ensure the neighbor exists in the list of things
        const neighborExists = things.some((t) => t.ip === neighbor.id);
  
        if (neighborExists && !addedConnections.has(connectionKey) && !addedConnections.has(reverseKey)) {
          connections.push({
            from: thing.ip,
            to: neighbor.id,
          });
          addedConnections.add(connectionKey); // Mark as added
        }
      });
    });
  
    return connections;
  };


  //STEP 4
  useEffect(() => {
    if (!containerRef.current) return;

    // Prepare nodes
    const nodes = new DataSet(
      networkData.things.map((thing) => {
        // Check if the error field is 1 (error exists)
        const hasError = thing.error === 1;

        return {
          id: thing.ip,
          label: `${thing.ip}\nHL: ${thing.hl_nt}\nTC: ${thing.tc_nt}`,
          title: `IP: ${thing.ip}\nNeighbors: ${thing.neighbors.map((n) => n.id).join(', ')}`,
          color: {
            background: hasError ? 'red' : '#97C2FC',  // Red if error, else light blue
            border: hasError ? 'darkred' : '#2B7CE9', // Dark red border if error
          },
          font: {
            size: 12,
            color: 'black',
          },
        };
      })
    );

    // Prepare edges
    const edges = new DataSet(
      networkData.connections.map((connection) => ({
        from: connection.from,
        to: connection.to,
        color: { color: '#848484' },
        width: 2,
      }))
    );

    // STEP 5: Network configuration
    const options = {
      nodes: {
        shape: 'dot',
        size: 25,
        font: {
          size: 12,
          align: 'center',
        },
      },
      edges: {
        arrows: {
          to: false,
          from: false,
        },
        width: 2,
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 200,
          springConstant: 0.08,
        },
        solver: 'forceAtlas2Based',
        stabilization: { iterations: 50 },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
      },
    };

    // Create network
    const network = new Network(containerRef.current, { nodes, edges }, options);

    // STEP 6:Network Interactivity
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = networkData.things.find((thing) => thing.id === nodeId);
        if (node) {
          console.log('Selected Node Details:', node);
          // You could trigger a modal or update a side panel with more info
        }
      }
    });

    return () => {
      network.destroy();
    };
  }, [networkData]);
//STEP 7:Rendering
  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '500px',
        border: '2px solid #2B7CE9',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    />
  );
};

export default DynamicNetworkGraph;
