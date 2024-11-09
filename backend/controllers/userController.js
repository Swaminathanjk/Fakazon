import User from "../models/User.js";
import { deleteUserFromFirebase } from "../config/firebaseAdmin.js";

// Create or update a user in the database
// controllers/userController.js
export const createUser = async (req, res) => {
  const { uid, name, email, address } = req.body; // Address may or may not be included

  try {
    // Check if the user already exists based on UID
    let user = await User.findOne({ uid });

    if (user) {
      // If user exists, update the information
      user.name = name;
      user.email = email;
      if (address) {
        user.address = address; // Update address if provided
      }
      await user.save();
      return res.status(200).json({ message: "User updated", user });
    } else {
      // If user doesn't exist, create a new one
      user = new User({
        uid,
        name,
        email,
        address, // Only include address if provided
      });
      await user.save();
      return res.status(201).json({ message: "User created", user });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating/updating user" });
  }
};

// Fetch user details by UID
export const getUserfromId = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Fetch all users (to be used for listing all users, if needed)
export const getUser = async (req, res) => {
  try {
    const users = await User.find(); // Optionally, you can add pagination or filtering here
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a user based on UID
export const deleteUser = async (req, res) => {
  const { uid } = req.params; // Get the UID from the route parameters

  try {
    // Step 1: Delete the user from Firebase Authentication
    await deleteUserFromFirebase(uid);

    // Step 2: Delete the user from MongoDB
    const user = await User.findOneAndDelete({ uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success response
    res
      .status(200)
      .json({ message: "User deleted successfully from Firebase and MongoDB" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting user from Firebase and MongoDB" });
  }
};

export const updateUser = async (req, res) => {
  const { uid } = req.params; // Get the user UID from route params
  const updates = req.body; // The body contains the fields to be updated

  try {
    // Find the user by UID
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields provided in the request
    for (let key in updates) {
      // Ensure you don't update the sensitive fields like uid (if not allowed)
      if (key !== 'uid') {
        user[key] = updates[key];
      }
    }

    // Save the updated user data
    await user.save();
    return res.status(200).json({ message: "User updated", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating user" });
  }
};

export const updateAddress = async (req, res) => {
  const { uid, address } = req.body; // Expecting uid and address in the request body

  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's address
    user.address = address;
    await user.save();

    return res
      .status(200)
      .json({ message: "Address updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating address" });
  }
};
