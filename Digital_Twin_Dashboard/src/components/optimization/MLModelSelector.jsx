import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from '@mui/material';
import { selectAlgorithm, updateThresholds } from '../../services/fastAPI'; // Import the service functions

const MLModelSelector = () => {
    const [selectedModel, setSelectedModel] = useState('');
    const [threshold, setThreshold] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
        setThreshold(''); // Clear the threshold value when switching models
        setDialogOpen(true); // Open dialog box on model selection
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleThresholdChange = (event) => {
        setThreshold(event.target.value);
    };

    const handleDialogSubmit = async () => {
        try {
            // Step 1: Select the algorithm
            await selectAlgorithm(selectedModel);

            // Step 2: Update the thresholds based on the selected model
            if (selectedModel === 'minimize_rcl') {
                await updateThresholds(parseFloat(threshold), null);
            } else if (selectedModel === 'minimize_rmo') {
                await updateThresholds(null, parseFloat(threshold));
            }

            console.log(`Model: ${selectedModel}, Threshold: ${threshold}`);
            setDialogOpen(false);
        } catch (error) {
            console.error('Error submitting model and threshold:', error);
        }
    };

    return (
        <div>
            <TextField
                select
                label="Select Model"
                value={selectedModel}
                onChange={handleModelChange}
                fullWidth
                InputLabelProps={{
                    style: {
                        color: 'white', // Only change the label color to white
                    },
                }}
            >
                <MenuItem value="minimize_rcl">Minimize RCL</MenuItem>
                <MenuItem value="minimize_overhead">Minimize RMO</MenuItem>
            </TextField>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>
                    {selectedModel === 'minimize_rmo' ? 'Set RMO Threshold' : 'Set RCL Threshold'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label={
                            selectedModel === 'minimize_overhead'
                                ? 'RMO Threshold'
                                : 'RCL Threshold'
                        }
                        type="number"
                        value={threshold}
                        onChange={handleThresholdChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleDialogSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

MLModelSelector.propTypes = {
    /** Add prop definitions if needed */
};

export default MLModelSelector;
