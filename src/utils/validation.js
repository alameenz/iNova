import mongoose from "mongoose";

export function validateProduct(data) {
  const errors = [];

  // Name
  if (!data.name?.trim()) {
    errors.push("Product name is required");
  } else if (data.name.trim().length < 3) {
    errors.push("Product name must be at least 3 characters");
  } else if (data.name.trim().length > 100) {
    errors.push("Product name must be less than 100 characters");
  }

  // Description
  if (!data.desc?.trim()) {
    errors.push("Product description is required");
  } else if (data.desc.trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  } else if (data.desc.trim().length > 1000) {
    errors.push("Description must be less than 1000 characters");
  }

  // Price
  if (data.price === undefined || data.price === null || data.price === "") {
    errors.push("Price is required");
  } else if (isNaN(data.price) || Number(data.price) <= 0) {
    errors.push("Price must be a positive number");
  }

  // Image URL
  if (!data.imageUrl?.trim()) {
    errors.push("Image URL is required");
  } else {
    try {
      const url = new URL(data.imageUrl.trim());

      if (!["http:", "https:"].includes(url.protocol)) {
        errors.push("Image URL must start with http:// or https://");
      }
    } catch {
      errors.push("Image URL must be a valid URL");
    }
  }

  return errors;
}

// Validate MongoDB ObjectId
export function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export function validateSignup(data) {
  const errors = [];

  // Name
  if (!data.name?.trim()) {
    errors.push("Name is required");
  } else if (data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (data.name.trim().length > 50) {
    errors.push("Name must be less than 50 characters");
  }

  // Email
  if (!data.email?.trim()) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email.trim())) {
      errors.push("Please enter a valid email address");
    }
  }

  // Password
  if (!data.password) {
    errors.push("Password is required");
  } else if (data.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  } else if (data.password.length > 100) {
    errors.push("Password must be less than 100 characters");
  }

  return errors;
}

export function validateLogin(data) {
  const errors = [];

  // Email
  if (!data.email?.trim()) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email.trim())) {
      errors.push("Please enter a valid email address");
    }
  }

  // Password
  if (!data.password) {
    errors.push("Password is required");
  }

  return errors;
}
