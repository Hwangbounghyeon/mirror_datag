"use server";
export const login = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    throw new Error("Email and password are required");
  }
};

export const signupEvent = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const passwordConfirm = formData.get("passwordConfirm");

  if (!email || !password || !passwordConfirm) {
    throw new Error("Email and password are required");
  }
};
