// src/components/Button.jsx
import React from "react";

const Button = React.forwardRef(
  (
    { variant = "default", size = "default", className = "", ...props },
    ref
  ) => {
    // Clases base comunes a todos los botones
    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

    // Variantes de estilo
    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      ghost: "hover:bg-gray-100 text-gray-700",
      link: "text-blue-600 underline-offset-4 hover:underline",
    };

    // Tamaños
    const sizeClasses = {
      default: "h-9 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-10 px-6 text-base",
      icon: "h-9 w-9 p-2",
    };

    // Combinar clases
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return <button ref={ref} className={classes} {...props} />;
  }
);

Button.displayName = "Button";

export { Button };
