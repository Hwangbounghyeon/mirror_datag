"use client";

import { Button, Input } from "@nextui-org/react";

export const LoginForm = () => {
  return (
    <form className="mt-8 space-y-6">
      <div className="space-y-4 rounded-md">
        <Input
          name="name"
          radius="sm"
          type="email"
          label="name"
          placeholder="Enter your name"
        />
        <Input
          radius="sm"
          type="password"
          label="password"
          placeholder="Enter your password"
        />
      </div>

      <Button className="w-full bg-purple-600 font-bold">Sign In</Button>
    </form>
  );
};

export default LoginForm;
