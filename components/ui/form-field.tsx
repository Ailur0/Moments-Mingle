import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: string;
  success?: string;
  required?: boolean;
  description?: string;
  className?: string;
}

interface FormInputProps extends FormFieldProps, React.ComponentProps<typeof Input> {}
interface FormTextareaProps extends FormFieldProps, React.ComponentProps<typeof Textarea> {}

export function FormInput({ 
  label, 
  error, 
  success, 
  required, 
  description, 
  className,
  ...props 
}: FormInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={props.id} className="flex items-center">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          {...props}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-green-500 focus-visible:ring-green-500"
          )}
        />
        {success && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>
      {description && !error && !success && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <div className="flex items-center space-x-1 text-destructive">
          <AlertCircle className="h-3 w-3" />
          <p className="text-xs">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center space-x-1 text-green-600">
          <CheckCircle className="h-3 w-3" />
          <p className="text-xs">{success}</p>
        </div>
      )}
    </div>
  );
}

export function FormTextarea({ 
  label, 
  error, 
  success, 
  required, 
  description, 
  className,
  ...props 
}: FormTextareaProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={props.id} className="flex items-center">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        {...props}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          success && "border-green-500 focus-visible:ring-green-500"
        )}
      />
      {description && !error && !success && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <div className="flex items-center space-x-1 text-destructive">
          <AlertCircle className="h-3 w-3" />
          <p className="text-xs">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center space-x-1 text-green-600">
          <CheckCircle className="h-3 w-3" />
          <p className="text-xs">{success}</p>
        </div>
      )}
    </div>
  );
}