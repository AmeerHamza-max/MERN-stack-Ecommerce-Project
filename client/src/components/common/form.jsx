import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

export const CommonForm = ({
  formControls = [],
  formData = {},
  setFormData,
  buttonText = "Submit",
  showButton = true,
  onSubmit,
}) => {
  // Handles input, textarea, and file changes
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Handles form submission safely
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") onSubmit(formData);
  };

  // Renders each form control based on its type
  const renderInput = (control) => {
    const { componentType, name, label, placeholder, type, options } = control;
    const value = formData[name] ?? "";

    switch (componentType) {
      case "input":
        return (
          <Input
            id={name}
            name={name}
            type={type || "text"}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-2 focus:border-amber-400 focus:ring-amber-400"
          />
        );

      case "textarea":
        return (
          <Textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-2 focus:border-amber-400 focus:ring-amber-400"
          />
        );

      // ✅ Fixed select section
      case "select":
        return (
          <Select
            value={value || ""} // Always controlled
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, [name]: val }))
            }
          >
            <SelectTrigger className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 focus:border-amber-400 focus:ring-amber-400">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 text-gray-200">
              {options?.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "file":
        return (
          <Input
            id={name}
            name={name}
            type="file"
            onChange={handleChange}
            className="bg-neutral-800 text-white border border-neutral-700 rounded px-3 py-2 focus:border-amber-400 focus:ring-amber-400"
          />
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formControls.map((control) => (
        <div key={control.name} className="flex flex-col gap-1">
          <Label htmlFor={control.name} className="text-gray-300 font-medium">
            {control.label}
          </Label>
          {renderInput(control)}
        </div>
      ))}

      {showButton && (
        <Button
          type="submit"
          className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 rounded"
        >
          {buttonText}
        </Button>
      )}
    </form>
  );
};
