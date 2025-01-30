import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  Box,
  Typography,
  FormControl,
  Autocomplete,
  Avatar,
  Chip,
} from "@mui/material";
import { userContext } from "../Context/UserState";
import { Add } from "@mui/icons-material";

const GroupForm = () => {
  const user = useContext(userContext);
  const [groupName, setGroupName] = useState("");
  const [groupIcon, setGroupIcon] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantInput, setParticipantInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${user.serverUrl}/api/user/getuser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response && response.status == 200) {
          setAllUsers(response.data);
          console.log(response.data);
        }
      } catch (e) {
        console.log("Error in GroupForm component", e);
      }
    };
    getUser();
  }, []);

  const handleAddParticipant = () => {
    if (
      participantInput.trim() !== "" &&
      allUsers.some((user) => user.username === participantInput)
    ) {
      setParticipants([...participants, participantInput]);
      setParticipantInput("");
    }
  };

  const handleRemoveParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ groupName, groupIcon, participants });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 500,
        margin: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h4" textAlign="center" color="primary">
        Create Group
      </Typography>
      <TextField
        label="Group Name"
        variant="outlined"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        fullWidth
        required
        color="secondary"
      />
      <TextField
        label="Group Icon URL"
        variant="outlined"
        value={groupIcon}
        onChange={(e) => setGroupIcon(e.target.value)}
        fullWidth
        required
        color="secondary"
      />
      <FormControl fullWidth margin="normal">
        <Autocomplete
          options={allUsers.map((user) => user.username)}
          value={participantInput}
          onChange={(event, newValue) => setParticipantInput(newValue)}
          renderInput={(params) => (
            <TextField
              label="Add Participant"
              variant="outlined"
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddParticipant();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ alignItems: "center" }}>
                    <Button
                      onClick={handleAddParticipant}
                      variant="contained"
                      color="primary"
                      size="small" // Adjust size for better alignment
                      sx={{
                        height: "100%", // Ensure it matches the height of the TextField
                        textTransform: "none",
                      }}
                    >
                      Add
                    </Button>
                  </InputAdornment>
                ),
              }}
              fullWidth
              margin="normal"
              color="secondary"
            />
          )}
        />
      </FormControl>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {participants.map((participant, index) => (
          <Chip
            key={index}
            label={participant}
            onDelete={() => handleRemoveParticipant(index)}
            color="primary"
            avatar={<Avatar>{participant[0].toUpperCase()}</Avatar>}
          />
        ))}
      </Box>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Submit
      </Button>
    </Box>
  );
};

export default GroupForm;
