import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import type { Alert } from "~/contexts/AlertContext";
import * as Toast from "@radix-ui/react-toast";

type IconComponent = ReturnType<typeof ExclamationCircleIcon>;

export const AlertMessage = ({ alert }: { alert: Alert }) => {
  const { type, message } = alert;

  let alertTypeClasses: string;
  let alertTypeIcon: IconComponent;

  switch (type) {
    case "WARNING":
      alertTypeClasses = "bg-yellow-600 text-white";
      alertTypeIcon = <ExclamationTriangleIcon className="h-6 w-6" />;
      break;

    case "ERROR":
      alertTypeClasses = "bg-red-600 text-white";

      alertTypeIcon = <ExclamationCircleIcon className="h-6 w-6" />;
      break;

    case "SUCCESS":
      alertTypeClasses = "bg-green-600 text-white";
      alertTypeIcon = <CheckCircleIcon className="h-6 w-6" />;
      break;

    default:
      alertTypeClasses = "bg-white text-black";
      alertTypeIcon = <InformationCircleIcon className="h-6 w-6" />;
      break;
  }

  return (
    <Toast.Root
      className={`grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out] ${alertTypeClasses}`}
      open={!!alert}
    >
      <div className="flex items-center">
        <div className="mr-2">{alertTypeIcon}</div>
        <Toast.Description>{message}</Toast.Description>
      </div>
    </Toast.Root>
  );
};
