// controllers/cartController.js
import { Cart } from "../models/Cart.js";

// Get the user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.uid }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ message: "Error fetching cart data" });
  }
};

// Add items to the cart
export const addToCart = async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items });
    } else {
      items.forEach((item) => {
        const index = cart.items.findIndex(
          (cartItem) => cartItem.productId._id.toString() === item.productId
        );
        if (index >= 0) {
          cart.items[index].quantity += item.quantity; // Update quantity if product already in cart
        } else {
          cart.items.push(item); // Add new product to cart if not already present
        }
      });
    }

    await cart.save();
    res.status(200).json(cart); // Send updated cart back to client
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// export const getCartCount = async (req, res) => {
//   const userId = req.user.uid; // assuming the user's UID is accessible from the request
//   try {
//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({ cartCount: 0 });
//     }

//     const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
//     res.status(200).json({ cartCount });
//   } catch (error) {
//     console.error("Error fetching cart count:", error);
//     res.status(500).json({ message: "Error fetching cart count" });
//   }
// };

// Clear the user's cart after order
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteOne({ userId: req.user.uid });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};

export const removeCartItem = async (req, res) => {
  const { userId } = req.body; // Get userId from the request body
  const { productId } = req.params; // Get productId from the URL params

  try {
    // Find the cart of the user by userId
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    // Find the item index in the cart using productId
    const itemIndex = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId
    );

    // If the item is found, remove it from the array
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1); // Remove the item
      await cart.save(); // Save the updated cart
      return res.status(200).send({ message: "Item removed from cart" });
    } else {
      return res.status(404).send({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

export const updateCartItem = async (req, res) => {
  const { userId, productId, quantity } = req.body; // Get necessary fields from request body

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId
    );

    // If item exists, update the quantity
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity; // Update quantity
      await cart.save(); // Save the updated cart
      return res.status(200).json(cart); // Return the updated cart
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Error updating cart" });
  }
};
