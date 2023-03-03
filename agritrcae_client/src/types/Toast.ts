export interface IToastProps {
  title: string;
  description: string;
  status: "success" | "error" | "warning" | "info";
  position?: "top" | "bottom";
}
