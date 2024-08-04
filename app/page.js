'use client';
import { useState, useEffect } from 'react';
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { firestore } from "@/firebase";
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateInventory();
    }
  }, []);

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
      setFilteredInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }
      await updateInventory();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }
      await updateInventory();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInventory(inventory);
    } else {
      const filteredItems = inventory
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      setFilteredInventory(filteredItems);
    }
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validate = (item) => {
    return item.trim() !== "";
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top='50%'
          left="50%"
          width={400}
          bgcolor={"white"}
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              required
              id="outlined-required"
              label="Required"
              autoComplete="off"
              fullWidth
              value={itemName}
              error={error}
              helperText={error ? "Input is required" : ""}
              onChange={(e) => {
                setItemName(e.target.value);
                setError(false);
              }}
            />
            <Button variant="outlined" onClick={async () => {
              if (validate(itemName)) {
                await addItem(itemName);
                setItemName('');
                setError(false);
                handleClose();
              } else {
                setError(true);
              }
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={43}
        justifyContent="space-between"
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1}
          justifyContent="space-between"
        >
          <TextField
            variant='outlined'
            value={searchTerm}
            autoComplete="off"
            onChange={(e) => setSearchTerm(e.target.value)}
          >
            Search
          </TextField>
          <Button variant="contained" endIcon={<SearchIcon />} onClick={() => setSearchTerm(searchTerm)}>
            Search
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            handleOpen();
          }}
        >
          Add New Item
        </Button>
      </Box>

      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>

        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor='#f0f0f0'
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Button variant="contained" onClick={() => {
                removeItem(name);
              }}>
                Remove Item
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
