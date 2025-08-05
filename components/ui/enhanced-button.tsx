import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface EnhancedButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  success?: boolean;
  successIcon?: React.ReactNode;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ children, loading, loadingText, icon, success, successIcon, className, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "transition-all duration-200",
          success && "bg-green-600 hover:bg-green-700",
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            {loadingText || "Loading..."}
          </>
        ) : success ? (
          <>
            {successIcon && <span className="mr-2">{successIcon}</span>}
            {children}
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </Button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";