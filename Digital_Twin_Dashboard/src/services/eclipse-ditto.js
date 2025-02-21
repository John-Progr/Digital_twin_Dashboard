const DITTO_API_BASE_URL = 'http://192.168.0.120:8080'; //Ditto url
const DITTO_USERNAME = 'ditto';
const DITTO_PASSWORD = 'ditto';

export const getDigitalTwinState = (onNewData) => {
  const authToken = btoa(`${DITTO_USERNAME}:${DITTO_PASSWORD}`);
  const url = `${DITTO_API_BASE_URL}/api/2/things`;
  
  let isConnected = false;
  let reader = null;
  let buffer = ''; // Buffer to handle partial chunks
  
  const connect = async () => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Authorization': `Basic ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      isConnected = true;
      console.log('Connected to Ditto');
      
      reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (isConnected) {
        const {done, value} = await reader.read();
        
        if (done) {
          console.log('Stream complete');
          break;
        }
        
        // Add new chunk to buffer and split by newlines
        buffer += decoder.decode(value);
        const lines = buffer.split('\n');
        
        // Keep the last line in buffer if it's incomplete
        buffer = lines.pop() || '';
        
        // Process each line
        for (const line of lines) {
          // Look specifically for data: lines with content
          if (line.startsWith('data:')) {
            const data = line.slice(5).trim(); // Remove 'data:' prefix
            if (data) { // Only process non-empty data
              try {
                const parsedEvent = JSON.parse(data);
                console.log('Received thing update:', parsedEvent);
                
                const mappedData = {
                  thingId: parsedEvent.thingId,
                  features: {
                    network: {
                      properties: parsedEvent.features?.network?.properties || {},
                    },
                  },
                };
                
                onNewData(mappedData);
              } catch (error) {
                console.error('Parse error:', error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Connection error:', error);
      isConnected = false;
      
      // Try to reconnect after a delay
      setTimeout(() => {
        if (!isConnected) {
          console.log('Attempting to reconnect...');
          connect();
        }
      }, 5000);
    }
  };
  
  // Start the initial connection
  connect();

  return {
    closeConnection: () => {
      isConnected = false;
      if (reader) {
        reader.cancel();
      }
      console.log('Connection to Ditto closed');
    }
  };
};

export const getDigitalTwinThings = async () => {
  const authToken = btoa(`${DITTO_USERNAME}:${DITTO_PASSWORD}`);
  const url = `${DITTO_API_BASE_URL}/api/2/things`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received Digital Twin Things:', data);

    // Extract relevant information (thingId, device_ip, error) from the response
    const extractedData = data.map((thing) => {
      const deviceIp = thing.features?.network?.properties?.device_ip || "N/A";
      const error = thing.features?.network?.properties?.error === 1 ? "Yes" : "No";
      return {
        thingId: thing.thingId,
        deviceIp,
        error,
      };
    });

    return extractedData;
  } catch (error) {
    console.error('Request error:', error);
    return [];
  }
};