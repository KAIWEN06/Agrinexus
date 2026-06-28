import { forwardRef } from "react";
import { cn } from "../../../utils/cn";

import {
  cardVariants,
  cardPadding,
} from "../../../constants/ui/card";

/* =====================================
   Root
===================================== */

const Card = forwardRef(
  (
    {
      children,
      variant = "default",
      padding = "md",
      hover = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--radius-card)]",
          "transition-all duration-200",

          cardVariants[variant],

          cardPadding[padding],

          hover &&
            "hover:-translate-y-1 hover:shadow-xl",

          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/* =====================================
   Header
===================================== */

const Header = ({ children, className }) => (
  <div
    className={cn(
      "flex flex-col gap-1.5",
      "pb-5",
      className
    )}
  >
    {children}
  </div>
);

/* =====================================
   Title
===================================== */

const Title = ({ children, className }) => (
  <h3
    className={cn(
      "text-lg font-semibold",
      "text-[var(--foreground)]",
      className
    )}
  >
    {children}
  </h3>
);

/* =====================================
   Description
===================================== */

const Description = ({
  children,
  className,
}) => (
  <p
    className={cn(
      "text-sm",
      "text-[var(--muted-foreground)]",
      className
    )}
  >
    {children}
  </p>
);

/* =====================================
   Content
===================================== */

const Content = ({ children, className }) => (
  <div
    className={cn(
      className
    )}
  >
    {children}
  </div>
);

/* =====================================
   Footer
===================================== */

const Footer = ({ children, className }) => (
  <div
    className={cn(
      "flex items-center",
      "pt-5",
      className
    )}
  >
    {children}
  </div>
);

Card.Header = Header;
Card.Title = Title;
Card.Description = Description;
Card.Content = Content;
Card.Footer = Footer;

export default Card;